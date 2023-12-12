import axios from 'axios';
import react, { useState } from "react";
import { Col, Container, Input, Row } from "reactstrap";
import style from "./Register.module.css";
import Swal from "sweetalert2";
import { useNavigate } from 'react-router';
import { CircularProgress } from '@mui/material';
import "@sweetalert2/themes/bootstrap-4";

const Register = () => {

    const navi = useNavigate();

    // 이메일 정규식 ( 99% 거를수 있다함. http://emailregex.com/ 참고 )
    const emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

    // ID 정규식
    const idRegex = new RegExp(/^[a-zA-Z0-9_.]{4,28}$/);
    
    // Password 정규식
    const passwordRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/);

    // 이메일 로딩 여부
    const [verifyLoading, setVerifyLoading] = useState(false);

    // 이메일 인증 코드
    const [verifyCode, setVerifyCode] = useState("");

    // 이메일 인증 코드 전송 여부
    const [isCodeSended, setIsCodeSended] = useState(false);

    // 이메일 인증 여부
    const [verified, setVerified] = useState(false);

    // ID 중복체크 여부
    const [isDupleChecked, setIsDupleChecked] = useState(false);

    // 비밀번호 확인 변수
    const [passwordConfirm, setPasswordConfirm] = useState("");

    // 비밀번호 일치 여부
    const [isPasswordMatched, setIsPasswordMatched] = useState(false);

    // 비밀번호 일치 여부 메시지
    const [passwordMatchMessage, setPasswordMatchMessage] = useState("");

    //contents_container 의 left 속성 값, 좌우로 이동할 때 씀
    const [leftPosition, setLeftPosition] = useState(0);

    // 신규 사용자 유저 정보
    const [userInfo, setUserInfo] = useState({ id: "", password: "", name: "", birth: "", contact: "", email: ""});

    const InputChangeHandler = (e) => {
        const { name, value } = e.target;
        setUserInfo(prev => ({ ...prev, [name]: value }));
    }

    const VerifyCodeChangeHandler = (e) => {
        setVerifyCode(e.target.value.replace(/[^0-9]/g, ""));
    }

    const ContactChangeHandler = (e) => {
        setUserInfo(prev => ({ ...prev, contact: e.target.value.replace(/[^0-9]/g, "")}));
    }

    const FirstNextBtnHandler = () => {
        setLeftPosition(-100);
    }
    const SecondNextBtnHandler = () => {
        if (verified)
            setLeftPosition(-200);
        else {
            Swal.fire({
                icon: "error",
                title: "어이쿠..!",
                text: "이메일 인증을 먼저 진행해주세요!"
            })
        }
    }
    const FirstBackBtnHandler = () => {
        setLeftPosition(0);
    }
    const SecondBackBtnHandler = () => {
        setLeftPosition(-100);
    }
    const EmailVerifyHandler = () => {
        if (userInfo.email == "") {
            Swal.fire({
                icon: "error",
                title: "어이쿠..!",
                text: "이메일을 입력해주세요!"
            })
            return;
        }
        if (emailRegex.test(userInfo.email)) {
            if(!isCodeSended) {
                setVerifyLoading(true);
                // 서버로 이메일 전송 요청
            axios.post(`/api/member/register/${userInfo.email}`)
            .then(response => {
                if (response.data === 'success') {
                    setIsCodeSended(true);
                    
                    Swal.fire({
                        icon: "success",
                        title: "해당 이메일로 인증번호를\n 전송했습니다.",
                        text: "인증번호를 빈 칸에 넣고 인증 버튼을 클릭해주세요!"
                    })
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "해당 이메일로 인증번호 전송을 실패했습니다...",
                        text: "이 현상이 지속적으로 발생할 경우 관리자에게 문의해주시기 바랍니다."
                    })
                }
            })
            .catch(error => {
                console.error('이메일 전송 에러:', error);
                Swal.fire({
                    icon: "error",
                    title: "이메일 전송 중 오류가 발생했습니다...",
                    text: "이 현상이 지속적으로 발생할 경우 관리자에게 문의해주시기 바랍니다."
                })
            }).finally(() => {
                setVerifyLoading(false);
            });

            } else {
                Swal.fire({
                    icon: "info",
                    title: "이미 인증 번호가 발송되었습니다!",
                    text: "이메일 우편함을 확인해주세요!"
                })
            }

        } else {
            Swal.fire({
                icon: "error",
                title: "올바른 이메일 형태가 아닙니다!",
                text: "이메일을 다시 확인해주세요!"
            })
        }
    }

    const handleCheck = () => {
        if(!verified) {
            // 서버로 인증코드 확인 요청
            axios.post(`/api/member/verify/${verifyCode}`)
                .then(response => {
                    if (response.data === 'success') {
                        Swal.fire({
                            icon: "success",
                            title: "인증 성공!",
                            text: "이제 다음 과정으로 넘어가세요!"
                        })
                        setVerified(true);
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "인증 실패...",
                            text: "인증 번호를 다시 확인해주세요!."
                        })
                        setVerified(false);
                    }
                })
                .catch(error => {
                    console.error('인증 에러:', error);
                    Swal.fire({
                        icon: "error",
                        title: "인증 중 오류가 발생했습니다...",
                        text: "이 현상이 지속적으로 발생할 경우 관리자에게 문의해주시기 바랍니다."
                    })
                });
        } else {
            Swal.fire({
                icon: "info",
                title: "이미 인증이 완료되었습니다!",
                text: "다음 과정으로 넘어가세요!"
            })
        }
        
    }

    const idChangerHandler = (e) => {
        setIsDupleChecked(false);
        setUserInfo(prev => ({...prev, id : e.target.value}));
    }

    const IdCheckHandler = () => {
        if(idRegex.test(userInfo.id)) {
            if(!isDupleChecked) {
                axios.post("/api/member/checkID", {id : userInfo.id}).then(resp => {
                    console.log(userInfo);
                    console.log(resp.data);
                    if(resp.data) {
                        Swal.fire({
                            icon: "error",
                            title: "이미 존재하는 아이디 입니다...",
                            text: "다른 아이디를 입력해주세요!"
                        })
                    } else {
                        Swal.fire({
                            icon: "success",
                            title: "중복 확인이 완료되었습니다!",
                            text: "사용 가능한 아이디입니다!"
                        })
                        setIsDupleChecked(true);
                    }
                }).catch(err => {
                    console.log(err);
                })
            } else {
                Swal.fire({
                    icon: "info",
                    title: "중복 확인이 완료되었습니다!",
                    text: "다음 항목으로 넘어가세요!"
                })
            }
        } else {
            Swal.fire({
                icon: "error",
                title: "아이디 형식이 맞지 않습니다...",
                text: "아이디는 4글자 이상 28글자 이하여야 합니다!"
            })
        }

        
        
    }

    const PasswordChangeHandler = (e) => {
        let pw = e.target.value;
        setUserInfo(prev => ({...prev, password : pw}))
        if(passwordRegex.test(pw)) {
            if(pw === "" || passwordConfirm === "") {
                setPasswordMatchMessage("");
            }
            else if(pw === passwordConfirm) {
                setPasswordMatchMessage("비밀번호와 일치합니다.");
                setIsPasswordMatched(true);
            } else {
                setPasswordMatchMessage("비밀번호와 일치하지 않습니다.");
                setIsPasswordMatched(false);
            }
        } else {
            setPasswordMatchMessage("비밀번호는 대소문자와 숫자를 포함하여 8글자 이상입니다.");
            setIsPasswordMatched(false);
        }
        
    }

    const PasswordConfirmChangeHandler = (e) => {
        let pwConfirm = e.target.value;
        setPasswordConfirm(pwConfirm);
        if(pwConfirm === "") {
            setPasswordMatchMessage("");
        } 
        else if(pwConfirm === userInfo.password) {
            setPasswordMatchMessage("비밀번호와 일치합니다.");
            setIsPasswordMatched(true);
        } else {
            setPasswordMatchMessage("비밀번호와 일치하지 않습니다.");
            setIsPasswordMatched(false);
        }
    }

    const pwMessageColorHandler = () => {
        if(isPasswordMatched) {
            return "green";
        } else {
            return "red";
        }
    }

    const SignUpHandler = () => {
        if(!verified) {
            Swal.fire({
                icon: "error",
                title: "이메일이 인증되지 않았습니다...",
                text: "그런데 어떻게 넘어오셨죠..?"
            })
            return;
        }
        if(!idRegex.test(userInfo.id)) {
            Swal.fire({
                icon: "error",
                title: "아이디 형식이 맞지 않습니다...",
                text: "아이디는 4글자 이상 28글자 이하여야 합니다!"
            })
            return;
        }
        if(!passwordRegex.test(userInfo.password)) {
            Swal.fire({
                icon: "error",
                title: "비밀번호 형식이 맞지 않습니다...",
                text: "비밀번호는 대소문자와 숫자를 포함하여 8글자 이상입니다!"
            })
            return;
        }
        if(!isDupleChecked) {
            Swal.fire({
                icon: "error",
                title: "아이디 중복검사를 하지 않았습니다...",
                text: "아이디 중복검사를 실행해주세요!"
            })
            return;
        }
        if(!isPasswordMatched) {
            Swal.fire({
                icon: "error",
                title: "비밀번호가 일치하지 않습니다...",
                text: "비밀번호를 다시 확인해주세요!"
            })
            return;
        }
        if(userInfo.name === "") {
            Swal.fire({
                icon: "error",
                title: "이름 입력란이 비어있습니다...",
                text: "이름을 다시 확인해주세요!"
            })
            return;
        }
        if(userInfo.contact === "") {
            Swal.fire({
                icon: "error",
                title: "연락처 입력란이 비어있습니다...",
                text: "연락처를 다시 확인해주세요!"
            })
            return;
        }
        if(userInfo.contact.length !== 11) {
            Swal.fire({
                icon: "error",
                title: "연락처 형식이 다릅니다...",
                text: "연락처 11자리를 다시 확인해주세요!"
            })
            return;
        }
        if(userInfo.birth === "") {
            Swal.fire({
                icon: "error",
                title: "생년월일 입력란이 비어있습니다...",
                text: "생년월일을 다시 확인해주세요!"
            })
            return;
        }
        axios.post("/api/member/register", userInfo).then(resp => {
            Swal.fire({
                icon: "success",
                title: "회원가입이 완료되었습니다!",
                text: "자동으로 메인화면으로 이동합니다!",
                timer: 2000
            }).finally(() => {
                navi("/");
            })
        }).catch(err => {
            console.log(err);
            Swal.fire({
                icon: "error",
                title: "오류가 발생했습니다...",
                text: "이 현상이 지속적으로 발생할 경우 관리자에게 문의해주시기 바랍니다.",
            })
        })
        
        
    } 


    return (
        <Container className={style.register_container} fluid>
            <Row className={`${style.row_header}`}>
                <h1>Create <strong>Airbuds</strong> Account</h1>
            </Row>

            <Row className={`${style.contents_container}`} style={{ left: `${leftPosition}vw`, transition: 'left 0.5s ease-in-out' }}>
                <Col xs={4} className={style.email_contents_container}>

                    <Row className={style.single_btn_container}>
                        <button className={`${style.btn_next} ${style.btn_css}`} onClick={FirstNextBtnHandler}>이메일로 시작하기</button>
                    </Row>

                    <hr className={style.hrTag}></hr>

                    <Row className={style.kakao_sign_up_container}>
                        <img src="/assets/kakao_sign_up_medium_wide_kor.png" className={style.social_image}></img>
                    </Row>


                </Col>

                <Col xs={4}>

                    <Row className={style.row_center}>
                        <Input className={style.input_email} name="email" type="text" placeholder="이메일로 계속하기..." onChange={InputChangeHandler} readOnly={isCodeSended}></Input>
                        <button className={`${style.btn_send_verify} ${style.btn_css}`} onClick={EmailVerifyHandler}>인증번호 발송</button>
                    </Row>

                    <Row className={style.verify_container}>
                        <Input className={style.input_verify} type="text" placeholder="인증번호" onChange={VerifyCodeChangeHandler} value={verifyCode} maxLength={6}></Input>
                        <button className={`${style.btn_verify} ${style.btn_css}`} onClick={handleCheck}>인증</button>
                    </Row>

                    <Row className={style.double_btn_container}>
                        <button className={`${style.btn_back} ${style.btn_css}`} onClick={FirstBackBtnHandler}>뒤로</button>
                        <button className={`${style.btn_next} ${style.btn_css}`} onClick={SecondNextBtnHandler}>다음</button>
                    </Row>

                </Col>

                <Col xs={4}>

                    <Row className={style.row_center}>
                        <Input className={style.input_id} name="id" type="text" placeholder="아이디" onChange={idChangerHandler} maxLength={28}></Input>
                        <button className={`${style.btn_check_id} ${style.btn_css}`} onClick={IdCheckHandler}>중복 검사</button>
                    </Row>

                    <Row className={style.row_center}>
                        <Input className={style.input_password} name="password" type="password" placeholder="비밀번호" onChange={PasswordChangeHandler}></Input>
                    </Row>

                    <Row className={style.row_center}>
                        <Input className={style.input_password_confirm} name="passwordConfirm" type="password" placeholder="비밀번호 확인" onChange={PasswordConfirmChangeHandler} value={passwordConfirm}></Input>
                    </Row>

                    <Row style={{justifyContent : "center"}}>
                        <p style={{color:pwMessageColorHandler()}}>{passwordMatchMessage}</p>
                    </Row>

                    <Row className={style.row_center}>
                        <Input className={style.input_password_confirm} name="name" type="text" placeholder="이름" onChange={InputChangeHandler}></Input>
                    </Row>

                    <Row className={style.row_center}>
                        <Input className={style.input_password_confirm} name="contact" type="text" placeholder="전화번호('-'제외)" onChange={ContactChangeHandler} value={userInfo.contact} maxLength={11}></Input>
                    </Row>

                    <Row className={style.row_center}>
                        <Input className={style.input_birth} name="birth" type="date" defaultValue="" onChange={InputChangeHandler}></Input>
                    </Row>

                    <Row className={style.double_btn_container}>
                        <button className={`${style.btn_back} ${style.btn_css}`} onClick={SecondBackBtnHandler}>뒤로</button>
                        <button className={`${style.btn_next} ${style.btn_css}`} onClick={SignUpHandler}>회원가입 완료</button>
                    </Row>

                </Col>

            </Row>
            <div className={style.loading} hidden={!verifyLoading}>
                <CircularProgress color="inherit" />
                <div>인증 코드 발송 중...</div>
            </div>

        </Container>

    )
}

export default Register;