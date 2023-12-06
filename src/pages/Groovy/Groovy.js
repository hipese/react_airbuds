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
<<<<<<< HEAD
import { Container, Row, Col } from "reactstrap";
import Upload_Main from "../Upload/Upload_Main";
=======
import { Container } from "reactstrap";
>>>>>>> b0d8c7f34b8f0d161ba88e8db40da033dab1aa92

const Groovy = () => {
    return (
        <Container className={styles.Container} fluid>
            <div>
                <div className={styles.topNavi}>
                    <TopNavigator />
                </div>
            </div>
            <Container className={styles.MainContainer} fluid>
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
            </Container>
            <div className={styles.botMusic}>
                <BottomMusic />
            </div>
        </Container>

    );
};

export default Groovy;
