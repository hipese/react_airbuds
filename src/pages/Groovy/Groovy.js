import React, { useContext, useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import styles from "./Groovy.module.css";
import Main from "../Main/Main";
import Feed from "../Feed/Feed";
import Library from "../Library/Library";
import Playlist from "../Playlist/Playlist";
import Mypage from "../Mypage/Mypage";
import Register from "../Register/Register";
import Login from "../Login/Login";
import Report from "../Report/Report";
import Admin from "../Admin/Admin";
import BottomMusic from "../Navigator/BottomMusic/BottomMusic";
import TopNavigator from "../Navigator/TopNavigator/TopNavigator";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col } from "reactstrap";
import AnnounceList from "../Announce/AnnounceList";
import QnaList from "../Qna/qnaList";
import Upload_Main from "../Upload/Upload_Main";
import DashBoardMain from "../Dashboard/Dashboard";
import Track_Detail from "../Detail/TrackDetail/Track_Detail";
import Editpage from "../Mypage/Editpage";
import MyAlbumDetail from "../Upload/MyAlbums/MyAlbumDetail/MyAlbumDetail";

import { RoleContext } from '../../App';
import Swal from "sweetalert2";

const Groovy = () => {
    const { userRole } = useContext(RoleContext);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.pathname.includes("/report") && userRole !== "ROLE_MANAGER") {
            showAlert("이 페이지에 대한 권한이 없음!");
            navigate("/");
        }
        if (location.pathname.includes("/dashboard") && userRole !== "ROLE_MANAGER") {
            showAlert("이 페이지에 대한 권한이 없음!");
            navigate("/");
        }
        if (location.pathname.includes("/announce/write") && userRole !== "ROLE_MANAGER") {
            showAlert("이 페이지에 대한 권한이 없음!");
            navigate("/");
        }
    }, [location, userRole, navigate]);

    const showAlert = (message) => {
        Swal.fire({
            title: '권한 오류',
            text: message,
            icon: 'error',
            confirmButtonText: '확인'
        });
    };

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
                    <Route path="Profile/:targetID/*" element={<Mypage />} />
                    <Route path="Mypage/*" element={<Editpage />} />
                    <Route path="Register/*" element={<Register />} />
                    <Route path="Login/*" element={<Login />} />
                    <Route path="Upload/*" element={<Upload_Main />} />
                    <Route path="Report/*" element={<Report />} />
                    <Route path="Admin/*" element={<Admin />} />
                    <Route path="Announce/*" element={<AnnounceList />} />
                    <Route path="Detail/:trackId/*" element={<Track_Detail />} />
                    <Route path="/Album/Detail/*" element={<MyAlbumDetail />} />
                    <Route path="QnA/*" element={<QnaList />} />
                    <Route path="Dashboard/*" element={<DashBoardMain />} />
                </Routes>
            </Container>
            <div className={styles.botMusic}>
                <BottomMusic />
            </div>
        </Container>

    );
};

export default Groovy;
