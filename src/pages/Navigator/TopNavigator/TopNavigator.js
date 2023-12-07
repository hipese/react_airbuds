import react, { useContext } from "react";
import styles from "./TopNavigator.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";
import SVGComponent from "./SVGComponent";
import { LoginContext } from "../../../App";
import React from "react";
import Swal from "sweetalert2";

const TopNavigator = () => {

    const {loginID, setLoginID} = useContext(LoginContext)

    const handleLoginClick = async () => {
        const { value: formValues } = await Swal.fire({
            title: 'Welcome Back',
            html: `
            <input type="text" id="username" class="swal2-input" placeholder="Username">
            <input type="password" id="password" class="swal2-input" placeholder="Password">
            <hr></hr>
            나중에 소셜 로그인 추가 예정
          `,
            confirmButtonText: "Login",
            focusConfirm: false,
            didOpen: () => {
                const popup = Swal.getPopup();
                let usernameInput = popup.querySelector('#username')
                let passwordInput = popup.querySelector('#password')
                usernameInput.onkeyup = (event) => event.key === 'Enter' && Swal.clickConfirm()
                passwordInput.onkeyup = (event) => event.key === 'Enter' && Swal.clickConfirm()
            },
            preConfirm: () => {
                const id = document.getElementById("username").value;
                const password = document.getElementById("password").value;
                if (!id || !password) {
                    Swal.showValidationMessage(`Please enter username and password`)
                }
                return { id, password }
            },
        })

        if (formValues) {
            console.log(formValues);
            // 로그인 axios
            // axios.post("/auth/login")
        }
    }

    return (
        <Container className={`${styles.container} ${styles.containerFluid}`} fluid>
            <Row>
                <Col className={styles.header_left}>
                    <Row>
                        <Col>
                            <Link className={styles.linksvg} to="/"><SVGComponent /></Link>
                        </Col>
                        <Col>
                            <Link className={styles.linkurl} to="/"><div>홈</div></Link>
                        </Col>
                        <Col>
                            <Link className={styles.linkurl} to="/Feed"><div>피드</div></Link>
                        </Col>
                        <Col>
                            <Link className={styles.linkurl} to="/Library"><div>라이브러리</div></Link>
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
                                        <Link className={styles.linkurl} to="/Playlist"><div>플레이리스트</div></Link>
                                    </Col>
                                    <Col>
                                        <Link className={styles.linkurl} to="/Upload"><div>업로드</div></Link>
                                    </Col>
                                    <Col>
                                        Profile
                                    </Col>
                                </>
                                :
                                <>
                                    <Col>
                                        <div onClick={handleLoginClick}>로그인</div>
                                    </Col>
                                    <Col>
                                        <Link className={styles.linkurl} to="/Register"><div>회원가입</div></Link>
                                    </Col>
                                </>
                        }
                        <Col>
                            ...
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}

export default TopNavigator;