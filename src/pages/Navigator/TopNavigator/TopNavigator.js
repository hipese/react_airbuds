import react, { useContext, useRef, useState } from "react";
import styles from "./TopNavigator.module.css";
import style from "./Modal.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";
import SVGComponent from "./SVGComponent";
import { LoginContext } from "../../../App";
import React from "react";
import Swal from "sweetalert2";
import "@sweetalert2/themes/bootstrap-4";
import axios from "axios";
import Dropdown from "react-bootstrap/Dropdown";
import { DropdownDivider } from "react-bootstrap";

const TopNavigator = () => {

    const [activeLink, setActiveLink] = useState("");
    
    const handleLinkClick = (e) => {
        setActiveLink(e);
    }
    const { loginID, setLoginID } = useContext(LoginContext);

    const nameRef = useRef();
    const emailRef = useRef();
    const idRef = useRef();
    // 이메일 인증 코드 전송 여부
    const [isCodeSended, setIsCodeSended] = useState(false);
    // 이메일 인증 여부
    const [verified, setVerified] = useState(false);

    const openIdModal = async () => {

        let currentStep = 1;

        const steps = [
            {
                title: "아이디 찾기",
                html: `
            <hr></hr>
            <label for="name">이름</label>
            <input type="text" id="name" placeholder='이름' class="swal2-input" />
            <label for="email">이메일</label>
            <input type="email" id="email" placeholder="이메일 주소" class="swal2-input" />
            <button id="sendVerification">인증번호발급</button>
            <label for="code">인증코드</label>
            <input type="text" id="code" placeholder="인증번호 입력" class="swal2-input" />
            <button id="checkVerification">인증번호확인</button>
          `,
            },
            {
                title: "아이디 찾기",
                html: `
            <hr></hr>
            <div id="finding"></div>
          `,
            },
        ];

        let sendButton = null;
        let checkButton = null;
        let nameInput = null;
        let emailInput = null;
        let codeInput = null;

        const swalResult = await Swal.fire({
            title: steps[currentStep - 1].title,
            html: steps[currentStep - 1].html,
            showCancelButton: true,
            confirmButtonText: "다음",
            cancelButtonText: "취소",
            focusConfirm: false,
            customClass: {
                container: 'custom-swal-container',
                popup: style.swal2PopUpHeWid,
                title: style.title,
                htmlContainer: style.text,
                confirmButton: style.confirm,
                cancelButton: style.cancel,
            },
            didOpen: () => {
                sendButton = document.getElementById("sendVerification");
                checkButton = document.getElementById("checkVerification");
                nameInput = document.getElementById("name");
                emailInput = document.getElementById("email");
                codeInput = document.getElementById("code");

                sendButton.addEventListener("click", async () => {
                    if (emailInput.value === "") {
                        Swal.showValidationMessage(`이메일을 입력해주세요`);
                    } else {
                        try {
                            axios.post(`/api/member/register/${emailInput.value}`).then(() => {
                                setIsCodeSended(true);
                                Swal.showValidationMessage(`이메일이 전송되었습니다`);
                            });

                            checkButton.addEventListener("click", async () => {
                                if (codeInput.value === "") {
                                    Swal.showValidationMessage(`인증번호를 입력해주세요`);
                                } else {
                                    axios.post(`/api/member/verify/${codeInput.value}`).then((resp) => {
                                        if (resp.data === "success") {
                                            Swal.showValidationMessage(`인증되었습니다`);
                                            setVerified(true);
                                        } else {
                                            Swal.showValidationMessage(`인증번호가 올바르지 않습니다`);
                                            setVerified(false);
                                        }
                                    });
                                }
                            });
                        } catch (error) {
                            Swal.showValidationMessage(`이메일 전송에 실패했습니다`);
                        }
                    }
                });
                if (nameInput.value === "") {
                    Swal.showValidationMessage(`이름을 입력해주세요`)
                }
                if (!isCodeSended) {
                    Swal.showValidationMessage(`이메일을 인증해주세요`)
                }
                if (!verified) {
                    Swal.showValidationMessage(`인증코드를 확인해주세요`)
                }
            }, preConfirm: () => {
                nameRef.current = nameInput.value;
                emailRef.current = emailInput.value;
            },
        });

        while (!swalResult.dismiss && currentStep < steps.length) {
            currentStep++;
            swalResult.value = await Swal.fire({
                title: steps[currentStep - 1].title,
                html: steps[currentStep - 1].html,
                showCancelButton: true,
                confirmButtonText: currentStep === steps.length ? "로그인" : "다음",
                cancelButtonText: "취소",
                focusConfirm: false,
                customClass: {
                    container: 'custom-swal-container',
                    popup: style.swal2PopUpHeWid,
                    title: style.title,
                    htmlContainer: style.text,
                    confirmButton: style.confirm,
                    cancelButton: style.cancel,
                },
                didOpen: () => {
                    let formData = new FormData();
                    formData.append("name", nameRef.current);
                    formData.append("email", emailRef.current);
                    axios.post("/api/member/findId", formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }).then((resp) => {
                        const finding = document.getElementById("finding");
                        //  findId 배열이 존재하고 최소 하나의 객체가 있을 때
                        if (Array.isArray(resp.data) && resp.data.length > 0) {
                            // id 값들을 추출하여 화면에 표시
                            const idList = resp.data.map(item => item.id);
                            finding.innerHTML = `고객님의 정보와 일치하는<br>아이디 목록입니다<br>${idList.map(id => `<div align="center">${id}</div>`).join('')}`;
                        }
                        else {
                            finding.innerHTML = '아이디를 찾을 수 없습니다';
                        }
                    })
                    const confirmButton = Swal.getConfirmButton();
                    confirmButton.addEventListener("click", handleLoginClick);
                }
            });
        }
    };

    const openPwModal = async () => {
        let currentStep = 1;

        const steps = [
            {
                title: "비밀번호 찾기",
                html: `
        <hr></hr>
        <label for="id">아이디</label>
        <input type="text" id="id" placeholder='아이디' class="swal2-input" />
        <label for="email">이메일</label>
        <input type="email" id="email" placeholder="이메일 주소" class="swal2-input" />
        <button id="sendVerification">인증번호발급</button>
        <label for="email">인증코드</label>
        <input type="text" id="code" placeholder="인증번호 입력" class="swal2-input" />
        <button id="checkVerification">인증번호확인</button>
      `,
            },
            {
                title: "비밀번호 찾기",
                html: `
              <hr></hr>
        <p>임시 비밀번호를 해당 이메일로 전송해드렸습니다.</p>
        <p>로그인 후 비밀번호를 변경해주세요.</p>
      `,
            },
        ];

        let sendButton = null;
        let checkButton = null;
        let idInput = null;
        let emailInput = null;
        let codeInput = null;

        const swalResult = await Swal.fire({
            title: steps[currentStep - 1].title,
            html: steps[currentStep - 1].html,
            showCancelButton: true,
            confirmButtonText: "다음",
            cancelButtonText: "취소",
            focusConfirm: false,
            customClass: {
                container: 'custom-swal-container',
                popup: style.swal2PopUpHeWid,
                title: style.title,
                htmlContainer: style.text,
                confirmButton: style.confirm,
                cancelButton: style.cancel,
            },
            didOpen: () => {
                sendButton = document.getElementById("sendVerification");
                checkButton = document.getElementById("checkVerification");
                idInput = document.getElementById("id");
                emailInput = document.getElementById("email");
                codeInput = document.getElementById("code");

                sendButton.addEventListener("click", async () => {
                    if (emailInput.value === "") {
                        Swal.showValidationMessage(`이메일을 입력해주세요`);
                    } else {
                        try {
                            axios.post(`/api/member/register/${emailInput.value}`).then(() => {
                                setIsCodeSended(true);
                                Swal.showValidationMessage(`이메일이 전송되었습니다`);
                            });

                            checkButton.addEventListener("click", async () => {
                                if (codeInput.value === "") {
                                    Swal.showValidationMessage(`인증번호를 입력해주세요`);
                                } else {
                                    axios.post(`/api/member/verify/${codeInput.value}`).then((resp) => {
                                        if (resp.data === "success") {
                                            Swal.showValidationMessage(`인증되었습니다`);
                                            setVerified(true);
                                        } else {
                                            Swal.showValidationMessage(`인증번호가 올바르지 않습니다`);
                                            setVerified(false);
                                        }
                                    });
                                }
                            });
                        } catch (error) {
                            Swal.showValidationMessage(`이메일 전송에 실패했습니다`);
                        }
                    }
                    if (idInput.value === "") {
                        Swal.showValidationMessage(`아이디를 입력해주세요`)
                    }
                    if (!isCodeSended) {
                        Swal.showValidationMessage(`이메일을 인증해주세요`)
                    }
                    if (!verified) {
                        Swal.showValidationMessage(`인증코드를 확인해주세요`)
                    }
                });
            }, preConfirm: () => {
                idRef.current = idInput.value;
                emailRef.current = emailInput.value;
            },
        });

        while (!swalResult.dismiss && currentStep < steps.length) {
            currentStep++;

            swalResult.value = await Swal.fire({
                title: steps[currentStep - 1].title,
                html: steps[currentStep - 1].html,
                showCancelButton: true,
                confirmButtonText: currentStep === steps.length ? "로그인" : "다음",
                cancelButtonText: "취소",
                focusConfirm: false,
                customClass: {
                    container: 'custom-swal-container',
                    popup: style.swal2PopUpHeWid,
                    title: style.title,
                    htmlContainer: style.text,
                    confirmButton: style.confirm,
                    cancelButton: style.cancel,
                }, didOpen: () => {
                    let formData = new FormData();
                    formData.append("id", idRef.current);
                    formData.append("email", emailRef.current);
                    axios.post("/api/member/password", formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }).then((resp) => {
                    })
                    const confirmButton = Swal.getConfirmButton();
                    confirmButton.addEventListener("click", handleLoginClick);
                }
            });
        }
    };
    
    const handleLoginClick = async () => {
        const { value: formValues } = await Swal.fire({
            title: 'Welcome Back',
            html: `
            <input type="text" id="username" class="swal2-input" placeholder="Username">
            <input type="password" id="password" class="swal2-input" placeholder="Password">
            <hr></hr>
            <a id="findIdLink" style="cursor: pointer; text-decoration: underline;">아이디 찾기</a>
            <a id="findPwLink" style="cursor: pointer; text-decoration: underline;">비밀번호 찾기</a>
          `,
            confirmButtonText: "Login",
            focusConfirm: false,
            didOpen: () => {
                const popup = Swal.getPopup();
                let usernameInput = popup.querySelector('#username')
                let passwordInput = popup.querySelector('#password')
                usernameInput.onkeyup = (event) => event.key === 'Enter' && Swal.clickConfirm()
                passwordInput.onkeyup = (event) => event.key === 'Enter' && Swal.clickConfirm()

                const findIdLink = document.getElementById("findIdLink");
                findIdLink.addEventListener("click", () => {
                    Swal.close();
                    openIdModal();
                });

                const findPwLink = document.getElementById("findPwLink");
                findPwLink.addEventListener("click", () => {
                    Swal.close();
                    openPwModal();
                });
            },
            preConfirm: () => {
                const id = document.getElementById("username").value;
                const password = document.getElementById("password").value;
                if (!id || !password) {
                    Swal.showValidationMessage(`Please enter ID and password`)
                }
                return { id, password }
            },
        })

        if (formValues) {
            // 로그인 axios
            let formData = new FormData();
            formData.append("id", formValues.id);
            formData.append("password", formValues.password);
            axios.post("/api/member/login", formData).then(resp => {
                setLoginID(formValues.id);
            }).catch(err => {
                if (err.response.status == 401) {
                    Swal.fire({
                        icon: "error",
                        title: "알수없는 아이디 혹은 비밀번호 입니다.",
                        text: "아이디와 비밀번호를 다시 확인해주세요.",
                    }).finally(handleLoginClick)
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "오류가 발생했습니다...",
                        text: "이 현상이 지속적으로 발생할 경우 관리자에게 문의해주시기 바랍니다.",
                    })
                }

            })
        }
    }

    const handleLogoutClick = () => {
        axios.post("/api/member/logout").then(() => {
            setLoginID("");
        }).catch(err => {
            console.log(err);
        })
    }

    return (
        <Container className={`${styles.container} ${styles.containerFluid}`} fluid>
            <Row>
                <Col className={styles.header_left}>
                    <Row>
                        <Col>
                            <Link className={styles.linksvg} to="/"><div onClick={() => handleLinkClick('home')}><SVGComponent /></div></Link>
                        </Col>
                        <Col>
                            <Link className={styles.linkurl} to="/"><div className={activeLink === 'home' ? styles.activeLink : styles.linkurl} onClick={() => handleLinkClick('home')}>홈</div></Link>
                        </Col>
                        <Col>
                            <Link className={styles.linkurl} to="/Feed"><div className={activeLink === 'Feed' ? styles.activeLink : styles.linkurl} onClick={() => handleLinkClick('Feed')}>피드</div></Link>
                        </Col>
                        <Col>
                            <Link className={styles.linkurl} to="/Library"><div className={activeLink === 'Library' ? styles.activeLink : styles.linkurl} onClick={() => handleLinkClick('Library')}>라이브러리</div></Link>
                        </Col>
                    </Row>
                </Col>
                <Col className={styles.header_center}>
                    <Row>
                        <Col className={styles.search}>
                            <input className={styles.searchbar} type="text" placeholder="Search..."></input>
                            <img src={`/assets/Search.svg`} alt="" className={styles.search_icon} />
                        </Col>
                    </Row>
                </Col>
                <Col className={styles.header_right}>
                    <Row>
                        {
                            loginID ?
                                <>
                                    <Col>
                                        <Link className={styles.linkurl} to="/Playlist"><div className={activeLink === 'Playlist' ? styles.activeLink : styles.linkurl} onClick={() => handleLinkClick('Playlist')}>플레이리스트</div></Link>
                                    </Col>
                                    <Col>
                                        <Link className={styles.linkurl} to="/Upload"><div className={activeLink === 'Upload' ? styles.activeLink : styles.linkurl} onClick={() => handleLinkClick('Upload')}>업로드</div></Link>
                                    </Col>
                                    <Col>
                                        <Link className={styles.linkurl} to={`/Profile/${loginID}`}><div>프로필</div></Link>
                                    </Col>
                                    <Col>
                                        <div className={styles.linkurl} onClick={handleLogoutClick}><div className={activeLink === 'logout' ? styles.activeLink : styles.linkurl} onClick={() => handleLinkClick('logoutt')}>로그아웃</div></div>
                                    </Col>
                                </>
                                :
                                <>
                                    <Col>
                                        <div className={styles.linkurl} onClick={handleLoginClick}><div className={activeLink === 'login' ? styles.activeLink : styles.linkurl} onClick={() => handleLinkClick('login')}>로그인</div></div>
                                    </Col>
                                    <Col>
                                        <Link className={styles.linkurl} to="/Register"><div className={activeLink === 'Register' ? styles.activeLink : styles.linkurl} onClick={() => handleLinkClick('Register')}>회원가입</div></Link>
                                    </Col>
                                </>
                        }
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}

export default TopNavigator;