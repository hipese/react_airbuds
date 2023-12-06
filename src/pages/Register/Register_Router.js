import { Route, Routes } from "react-router";
import { Container, Input, Row } from "reactstrap";
import style from "./Register.module.css";
import Register from "./Register";
import { createContext, useState } from "react";

export const UserInfoContext = createContext();

const Register_Router = () => {

    const [userInfo, setUserInfo] = useState({id:"", password:"", name:"", birth:"", contact:"", profile_image:"", background_image:""});

    return (
        <Container>
            <Row className={`${style.row_center} ${style.row_header}`}>
                <h1>Create <strong>Airbuds</strong> Account</h1>
            </Row>

            <Row className={`${style.row_center} ${style.contents}`}>
                <Input type="text" placeholder="Continue with E-mail"></Input>
            </Row>

            <hr></hr>

            <Row className={style.row_center}>
                <img src="/assets/kakao_login_medium_wide.png" className={style.social_image}></img>
            </Row>
            
            <UserInfoContext.Provider>
                <Routes>
                    <Route path="/" element={Register} />
                </Routes>
            </UserInfoContext.Provider>

        </Container>

    )
};

export default Register_Router;