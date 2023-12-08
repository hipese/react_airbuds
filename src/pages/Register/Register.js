import axios from 'axios';
import react, { useState } from "react";
import { Col, Container, Input, Row } from "reactstrap";
import style from "./Register.module.css";
import Swal from "sweetalert2";

const Register = () => {

    // 이메일 정규식 ( 99% 거를수 있다함. http://emailregex.com/ 참고 )
    const emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

    const [verifyCode, setVerifyCode] = useState(null);

    // 이메일 인증 여부
    const [verified, setVerified] = useState(false);

    //contents_container 의 left 속성 값, 좌우로 이동할 때 씀
    const [leftPosition, setLeftPosition] = useState(0);

    // 신규 사용자 유저 정보
    const [userInfo, setUserInfo] = useState({ id: "", password: "", name: "", birth: "", contact: "", email: "", profile_image: "", background_image: "" });

    const InputChangeHandler = (e) => {
        const { name, value } = e.target;
        setUserInfo(prev => ({ ...prev, [name]: value }));
    }

    const VerifyCodeChangeHandler = (e) => {
        setVerifyCode(e.target.value);
    }

    const FirstNextBtnHandler = () => {
        setLeftPosition(-100);
    }
    const SecondNextBtnHandler = () => {
        // if (verified)
        //     setLeftPosition(-200);
        // else {
        //     Swal.fire({
        //         icon: "error",
        //         title: "어이쿠..!",
        //         text: "이메일 인증을 먼저 진행해주세요!"
        //     })
        // }
        setLeftPosition(-200);

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

            console.log("True");

            // 이메일 인증 코드 넣어야 함
            // 서버로 이메일 전송 요청
            axios.post(`/api/member/register/${userInfo.email}`)
                .then(response => {
                    if (response.data === 'success') {
                        Swal.fire({
                            icon: "success",
                            title: "해당 이메일로 인증번호를 전송했습니다.",
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
                });



        } else {
            Swal.fire({
                icon: "error",
                title: "올바른 이메일 형태가 아닙니다!",
                text: "이메일을 다시 확인해주세요!"
            })
        }
    }

    const handleCheck = () => {
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
    }

    const IdCheckHandler = () => {

    }

    const PasswordConfirmChangeHandler = (e) => {

    }

    const SignUpHandler = () => {
        console.log("Done!");
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
                        <Input className={style.input_email} name="email" type="text" placeholder="이메일로 계속하기..." onChange={InputChangeHandler}></Input>
                        <button className={`${style.btn_send_verify} ${style.btn_css}`} onClick={EmailVerifyHandler}>인증번호 발송</button>
                    </Row>

                    <Row className={style.verify_container}>
                        <Input className={style.input_verify} type="number" placeholder="인증번호" onChange={VerifyCodeChangeHandler}></Input>
                        <button className={`${style.btn_verify} ${style.btn_css}`} onClick={handleCheck}>인증</button>
                    </Row>

                    <Row className={style.double_btn_container}>
                        <button className={`${style.btn_back} ${style.btn_css}`} onClick={FirstBackBtnHandler}>뒤로</button>
                        <button className={`${style.btn_next} ${style.btn_css}`} onClick={SecondNextBtnHandler}>다음</button>
                    </Row>

                </Col>

                <Col xs={4}>

                    <Row className={style.row_center}>
                        <Input className={style.input_id} name="id" type="text" placeholder="아이디" onChange={InputChangeHandler}></Input>
                        <button className={`${style.btn_check_id} ${style.btn_css}`} onClick={IdCheckHandler}>중복 검사</button>
                    </Row>

                    <Row className={style.row_center}>
                        <Input className={style.input_password} name="password" type="password" placeholder="비밀번호" onChange={InputChangeHandler}></Input>
                    </Row>

                    <Row className={style.row_center}>
                        <Input className={style.input_password_confirm} name="password" type="password" placeholder="비밀번호 확인" onChange={PasswordConfirmChangeHandler}></Input>
                        <br></br>

                    </Row>

                    <Row className={style.double_btn_container}>
                        <button className={`${style.btn_back} ${style.btn_css}`} onClick={SecondBackBtnHandler}>뒤로</button>
                        <button className={`${style.btn_next} ${style.btn_css}`} onClick={SignUpHandler}>회원가입 완료</button>
                    </Row>

                </Col>

            </Row>

        </Container>

    )
}

export default Register;