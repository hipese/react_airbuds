import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import styles from "./Groovy.module.css";
import Main from "../Main/Main";
import Feed from "../Feed/Feed";
import Library from "../Library/Library";
import Playlist from "../Playlist/Playlist";
import Music from "../Music/Music";
import Register from "../Register/Register";
import Login from "../Login/Login";
import Report from "../Report/Report";
import Admin from "../Admin/Admin";
import BottomMusic from "../Navigator/BottomMusic/BottomMusic";
import TopNavigator from "../Navigator/TopNavigator/TopNavigator";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col } from "reactstrap";
import Upload_Main from "../Upload/Upload_Main";

const Groovy = () => {
    return (
        <Container fluid>
            <Row>
                <Col className={styles.topNavi}>
                    <TopNavigator />
                </Col>
            </Row>
            <Container className={`${styles.container} ${styles.MainContainer}`} fluid>
                <Row>
                    <Routes>
                        <Route path="/" element={<Main />} />
                        <Route path="Feed/*" element={<Feed />} />
                        <Route path="Library/*" element={<Library />} />
                        <Route path="Playlist/*" element={<Playlist />} />
                        <Route path="Music/*" element={<Music />} />
                        <Route path="Register/*" element={<Register />} />
                        <Route path="Login/*" element={<Login />} />
                        <Route path="Upload/*" element={<Upload_Main />} />
                        <Route path="Report/*" element={<Report />} />
                        <Route path="Admin/*" element={<Admin />} />
                    </Routes>
                </Row>
            </Container>
            <Row className={styles.botMusic}>
                <BottomMusic />
            </Row>
        </Container>

    );
};

export default Groovy;
