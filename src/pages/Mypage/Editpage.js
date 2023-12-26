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

    const {loginID} = useContext(LoginContext);
    const navi = useNavigate();
    const [profileImage, setProfileImage] = useState("");
    const [newID, setNewID] = useState("");
    const [isDupleChecked, setIsDupleChecked] = useState(false);
    const [newPassword, setNewPassword] = useState("");

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
            Swal.fire({
                icon: "error",
                title: "로그인 후 이용해주세요...",
                text: "자동으로 메인화면으로 이동합니다...",
                timer: 3000
            }).finally(() => {
                navi("/");
            })
        }
    }, [loginID]);

    const IdChangeHandler = () => {
        Swal.fire({
            title: '아이디 변경',
            html: `
            <input type="text" id="username" class="swal2-input" placeholder="Username">
          `,
            confirmButtonText: "적용하기",
            focusConfirm: false,
            didOpen: () => {
                const popup = Swal.getPopup();
            },
            preConfirm: () => {
                const id = document.getElementById("username").value;
                if (!id) {
                    Swal.showValidationMessage(`Please enter ID and password`)
                }
            },
        })
    }


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
                            <Button component="label" variant="contained" startIcon={<CloudUploadIcon />} type="file">
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
                        <button className={`${style.btn_change} ${style.btn_margin}`}>비밀번호 변경</button>
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