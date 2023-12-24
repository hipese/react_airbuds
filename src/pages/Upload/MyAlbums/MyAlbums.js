import { Button } from "reactstrap";
import styles from "./MyAlbums.module.css"
import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { LoginContext } from "../../../App";
import { Box, CircularProgress } from "@mui/material";
import AlbumsCarousel from "./AlbumsCarousel/AlbumsCarousel"
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import AddPrevAlbum from "./AddPrevAlbum/AddPrevAlbum";
import Modal from '@mui/material/Modal';
import { useNavigate } from "react-router";

const MyAlbums = () => {


    const [selectTitle, setSelectTitle] = useState([]);

    const { loginID, setLoginID } = useContext(LoginContext);
    const storageId = localStorage.getItem("loginID");
    const [isFavorite, setFavorite] = useState(0);
    const [loading, setLoading] = useState(true);

    const [myAlbumsInfo, setMyAlbumsInfo] = useState([]);
    const [createAlbum,setCreateAlbum]= useState([]);

    const navigator=useNavigate();

    useEffect(() => {
        axios.get(`/api/album/findByLogin`).then(resp => {
            console.log(resp.data)
            setMyAlbumsInfo(resp.data);
            setLoading(false);
        })

    }, [loginID]);


    const [open, setOpen] = useState(false);
    const handleOpen = () => {

        axios.post("/api/album/emptyAlbum").then(resp=>{
            console.log(resp.data)
            setCreateAlbum(resp.data)
        })

        setOpen(true);
    }

    const handleCancle = () => {
        setOpen(false);
        
    };

    const handleModalClose = (event, reason) => {
        if (reason && reason === "backdropClick") {
            handleCancle();
        } else {
            handleCancle();
        }
    };

    const handleAddAlbum = () => {
        navigator("/Upload");
    }

    // const CircularIndeterminate = () => {
    //     return (
    //         <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    //             <CircularProgress />
    //         </Box>
    //     );
    // };

    // if (loading) {
    //     return <CircularIndeterminate />;
    // }

    return (
        <div className={styles.container}>
            <div className={styles.contentContainer}>
                <div className={styles.leftSide}>

                    <div className={styles.carouselTitle}>내 앨범목록</div>
                    <div className={styles.carousel}>
                        <AlbumsCarousel myAlbumsInfo={myAlbumsInfo} />
                    </div>


                    <div className={styles.leftBottom}>
                        <Button className={styles.button_custom} onClick={handleAddAlbum}>
                            <PlaylistAddIcon className={styles.icon_custom} />
                            앨범 생성하기
                        </Button>
                        {/* 기존 앨범에 있는거 추가하는 기능(시간이 없어서 일단 미완성으로 ㄱ) */}
                        {/* <Modal
                            open={open}
                            onClose={handleModalClose}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <AddPrevAlbum
                                 createAlbum={createAlbum}
                                 setCreateAlbum={setCreateAlbum}
                                 onClose={handleCancle}
                            />
                        </Modal> */}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default MyAlbums;
