import react, { useState } from "react";
import { Col, Container, Input, Row } from "reactstrap";
import style from "./Register.module.css";

const Register = () => {

    const [leftPosition, setLeftPosition] = useState(0)
    const [userInfo, setUserInfo] = useState({id:"", password:"", name:"", birth:"", contact:"" , email:"", profile_image:"", background_image:""});

    const InputChangeHandler = (e) => {
        const {name, value} = e.target;
        setUserInfo(prev => ({...prev,[name]:value}));
    }

    const FirstNextBtnHandler = () => {
        setLeftPosition(-100);
    }
    const SecondNextBtnHandler = () => {
        setLeftPosition(-200);
    }
    const FirstBackBtnHandler = () => {
        setLeftPosition(0);
    }
    const SecondBackBtnHandler = () => {
        setLeftPosition(-100);
    }
    const SignUpHandler = () => {
        console.log("Done!");
    }



    return (
        <Container className={style.register_container} fluid>
            <Row className={`${style.row_center} ${style.row_header}`}>
                <h1>Create <strong>Airbuds</strong> Account</h1>
            </Row>

            <Row className={`${style.contents_container}`} style={{left : `${leftPosition}vw`, transition: 'left 0.5s ease-in-out'}}>
                <Col xs={4} className={style.email_contents_container}>

                    <Row className={style.single_btn_container}>
                        <button className={`${style.btn_next} ${style.btn_move}`} onClick={FirstNextBtnHandler}>Continue with E-mail</button>
                    </Row>

                    <Row className={style.kakao_sign_up_container}>
                        <img src="/assets/kakao_sign_up_medium_wide.png" className={style.social_image}></img>
                    </Row>

                    
                </Col>

                <Col xs={4}>

                    <Row className={style.row_center}>
                        <Input className={style.input_email} name="email" type="text" placeholder="Continue with E-mail" onChange={InputChangeHandler}></Input>
                    </Row>

                    <Row className={style.double_btn_container}>
                        <button className={`${style.btn_back} ${style.btn_move}`} onClick={FirstBackBtnHandler}>Back</button>
                        <button className={`${style.btn_next} ${style.btn_move}`} onClick={SecondNextBtnHandler}>Next</button>
                    </Row>

                </Col>

                <Col xs={4}>

                    <Row className={style.row_center}>
                        <Input className={style.input_email} name="email" type="text" placeholder="Continue with E-mail" onChange={InputChangeHandler}></Input>
                    </Row>

                    <Row className={style.double_btn_container}>
                        <button className={`${style.btn_back} ${style.btn_move}`} onClick={SecondBackBtnHandler}>Back</button>
                        <button className={`${style.btn_next} ${style.btn_move}`} onClick={SignUpHandler}>Done!</button>
                    </Row>

                </Col>
                
            </Row>

        </Container>

    )
}

export default Register;