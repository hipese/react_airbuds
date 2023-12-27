import { Col, Container, Row } from "reactstrap";
import style from "./Editpage.module.css";
import { styled } from '@mui/material/styles';
import { Avatar, Button } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import TextField from '@mui/material/TextField';
import { useContext, useEffect, useState } from "react";
import { LoginContext } from "../../App";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const Editpage = () => {

    // ID 정규식
    const idRegex = new RegExp(/^[a-zA-Z0-9_.]{4,28}$/);
    
    // Password 정규식
    const passwordRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/);

    const {loginID, setLoginID} = useContext(LoginContext);
    const navi = useNavigate();
    const [profileImage, setProfileImage] = useState("");


    useEffect(()=> {
        // 프로필 이미지
        axios.get(`/api/member/getProfile`).then((resp) => {
            setProfileImage(resp.data.profile_image);
        }).catch(err => {
            Swal.fire({
                icon: "error",
                title: "로그인 후 이용해주세요...",
                text: "자동으로 메인화면으로 이동합니다...",
                timer: 3000
            }).finally(() => {
                navi("/");
            })
        })
    }, []);

    useEffect(()=> {
        if(loginID === null || loginID === "") {
            navi("/");
        }
    }, [loginID]);

    const IdChangeHandler = async () => {
        const newID = await Swal.fire({
            title: '새로운 아이디 입력',
            html: `
            <input type="text" id="username" class="swal2-input" placeholder="Username">
          `,
            validationMessage : "아이디 변경 후 다시 로그인 해주세요!",
            confirmButtonText: "적용하기",
            focusConfirm: false,
            didOpen: () => {
                const popup = Swal.getPopup();
                let usernameInput = popup.querySelector('#username')
                usernameInput.onkeyup = (event) => event.key === 'Enter' && Swal.clickConfirm()
            },
            preConfirm: () => {
                const id = document.getElementById("username").value;
                if (!idRegex.test(id)) {
                    Swal.showValidationMessage(`아이디는 4글자 이상 28글자 이하여야 합니다.`)
                }
                return id;
            },
        })
        
        if(newID.value) {
            axios.post("/api/member/checkID", {id : newID.value}).then(resp => {
                console.log(resp.data);
                if (resp.data) {
                    Swal.fire({
                        icon: "error",
                        title: "이미 존재하는 아이디 입니다...",
                        text: "다른 아이디를 입력해주세요!"
                    })
                } else {
                    axios.put("/api/member/changeID", newID.value, {headers : {'Content-Type' : 'text/plain'}}).then(resp => {
                        Swal.fire({
                            icon: "success",
                            title: "적용이 완료되었습니다!",
                            text: "자동으로 로그아웃 됩니다. 다시 로그인 해주세요!",
                            timer : 3000,
                            showConfirmButton : false
                        }).finally(() => {
                            setLoginID("");
                        })
                    }).catch(err => {
                        Swal.fire({
                            icon: "error",
                            title: "적용에 실패했습니다...",
                            text: "이 현상이 지속된다면 관리자에게 문의해주세요!"
                        })
                    })
    
                }
            }).catch(err => {
                Swal.fire({
                    icon: "error",
                    title: "아이디 검사에 실패했습니다...",
                    text: "이 현상이 지속된다면 관리자에게 문의해주세요!"
                })
            })
        }
    }

    const PwChangeHandler = async () => {
        const {value : formValues} = await Swal.fire({
            title: '비밀번호 변경',
            html: `
            <input type="password" id="password" class="swal2-input" placeholder="현재 비밀번호">
            <input type="password" id="newPassword" class="swal2-input" placeholder="새 비밀번호">
            <input type="password" id="newPasswordConfirm" class="swal2-input" placeholder="새 비밀번호 확인">
          `,
            confirmButtonText: "변경하기",
            focusConfirm: false,
            didOpen: () => {
                const popup = Swal.getPopup();
                let newPasswordConfirmInput = popup.querySelector('#newPasswordConfirm')
                newPasswordConfirmInput.onkeyup = (event) => event.key === 'Enter' && Swal.clickConfirm()
            },
            preConfirm: () => {
                const password = document.getElementById("password").value;
                const newPassword = document.getElementById("newPassword").value;
                const newPasswordConfirm = document.getElementById("newPasswordConfirm").value;
                if (password === "" || newPassword === "" || newPasswordConfirm === "") {
                    Swal.showValidationMessage(`빈칸 없이 입력해주세요.`)
                }
                if (newPassword !== newPasswordConfirm) {
                    Swal.showValidationMessage(`새 비밀번호와 새 비밀번호 확인 값이 다릅니다.`)
                }
                if (!passwordRegex.test(newPassword)) {
                    Swal.showValidationMessage(`비밀번호는 대소문자와 숫자를 포함하여 8글자 이상입니다.`)
                }
                return {password, newPassword};
            },
        })
        
        if(formValues) {
            axios.post("/api/member/chagePW", {password : formValues.password, newPassword : formValues.newPassword}).then(resp => {
                console.log(resp);
                Swal.fire({
                    icon: "success",
                    title: "적용이 완료되었습니다!",
                    text: "자동으로 로그아웃 됩니다. 다시 로그인 해주세요!",
                    timer : 3000,
                    showConfirmButton : false
                }).finally(() => {
                    setLoginID("");
                })
            }).catch(err => {
                if(err.response.status === 503) {
                    Swal.fire({
                        icon: "error",
                        title: "비밀번호 변경에 실패했습니다...",
                        text: "이 현상이 지속된다면 관리자에게 문의해주세요!"
                    })
                } else if(err.response.status === 401) {
                    Swal.fire({
                        icon: "error",
                        title: "로그아웃된 상태입니다....",
                        text: "다시 로그인 후 시도해주세요. 자동으로 메인화면으로 이동합니다.",
                        timer : 3000,
                        showConfirmButton : false
                    }).finally(() => {
                        setLoginID("");
                    })
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "비밀번호 변경에 실패했습니다...",
                        text: "이 현상이 지속된다면 관리자에게 문의해주세요!"
                    })
                }
                
            })
        }
    }
    const changeProfileHandler = (e) => {
        const newImagePath = URL.createObjectURL(e.target.files[0]);
        const formData = new FormData();
        formData.append("newProfileImage", e.target.files[0]);
        axios.post("/api/member/uploadProfile", formData, { headers: { "Content-Type": "multipart/form-data" } })
            .then(resp => {
                setProfileImage(resp.data)
                Swal.fire({
                    icon: "success",
                    title: "프로필 적용이 완료되었습니다!",
                    text: "",
                })
            }).catch(err => {
                Swal.fire({
                    icon: "error",
                    title: "프로필 변경에 실패했습니다...",
                    text: "이 현상이 지속된다면 관리자에게 문의해주세요!"
                })
            });
    };



    return (
        <Container>
            <Row className={style.total_container}>
                <Col xs={12} md={5} className={style.profile_container}>
                    <Row>
                        <Col xs={12} className={style.avatar_container}>
                            <Avatar sx={{width : "12vw", height : "12vw"}} src={profileImage}>
                            </Avatar>
                        </Col>
                        <Col xs={12} className={style.avatar_btn_container}>
                            <Button component="label" variant="contained" startIcon={<CloudUploadIcon />} type="file" onChange={changeProfileHandler}>
                                Upload Image
                                <VisuallyHiddenInput type="file" />
                            </Button>
                        </Col>
                    </Row>
                </Col>
                <Col xs={12} md={7} className={style.info_container}>
                    <Row className={style.info_textfield_container}>
                        <h4>{loginID}</h4>
                        <button className={style.btn_change} style={{marginLeft : 20, width : 100, height : 30}} onClick={IdChangeHandler}>아이디 변경</button>
                        {/* <TextField label="ID" helperText="4글자 이상 28글자 이하" className={style.info_header} defaultValue={`${loginID}`}></TextField> */}
                    </Row>

                    <Row className={style.info_textfield_container}>
                        {/* <TextField label="비밀번호" helperText="대소문자와 숫자를 포함하여 8글자 이상" className={style.info_header} defaultValue={``} type="password"></TextField> */}
                        <button className={`${style.btn_change} ${style.btn_margin}`} onClick={PwChangeHandler}>비밀번호 변경</button>
                    </Row>

                    <Row className={style.info_textfield_container}>
                        <button className={`${style.btn_change} ${style.btn_margin}`}>내 정보 수정</button>
                        {/* <TextField label="비밀번호 확인" helperText="" className={style.info_header} defaultValue={``} type="password"></TextField> */}
                    </Row>

                    <Row className={style.info_textfield_container}>
                        {/* <TextField label="이름" helperText=" " className={style.info_header} defaultValue={``}></TextField> */}
                    </Row>

                    <Row className={style.info_textfield_container}>
                        {/* <TextField label="연락처" helperText="" className={style.info_header} defaultValue={``}></TextField> */}
                    </Row>

                </Col>
            </Row>

        </Container>
    )
};

export default Editpage;