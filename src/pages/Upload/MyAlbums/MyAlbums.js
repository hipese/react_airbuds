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
import AlbumSearchResult from "../../ShowMusicList/SearchResult/AlbumSearchResult";
import NoTrackInfo from "../NoMusic/NoTrackInfo";


// 로딩바
const LoadingSpinner = () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress color="inherit" />
    </Box>
);

const MyAlbums = () => {


    const [selectTitle, setSelectTitle] = useState([]);

    const { loginID, setLoginID } = useContext(LoginContext);
    const storageId = localStorage.getItem("loginID");
    const [isFavorite, setFavorite] = useState(0);
    const [loading, setLoading] = useState(true);

    const [searchAlbums, setSearchAlbums] = useState([]);
    const [createAlbum, setCreateAlbum] = useState([]);

    const navigator = useNavigate();

    useEffect(() => {

        axios.get(`/api/album/findByLogin`).then(resp => {
            console.log(resp.data)
            setSearchAlbums(resp.data);
            setLoading(false);
        })

    }, [loginID]);

    const [text, setText] = useState("앨범");

    const [open, setOpen] = useState(false);
    const handleOpen = () => {

        axios.post("/api/album/emptyAlbum").then(resp => {
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

    // 잠깐만 죽어봐
    // const handleAlbumClick = (albumId) => {
    //     const albumData = myAlbumsInfo.find(album => album.albumId === albumId);
    //     navigate(`/Album/Detail/${albumId}`, { state: { albumData } });
    // }

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
                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            <div className={styles.carousel}>
                                {searchAlbums.length === 0 ? (
                                    <NoTrackInfo text={text} />
                                ) : (
                                    <AlbumSearchResult searchAlbums={searchAlbums} />
                                )}
                            </div>

                            <div className={styles.leftBottom}>
                                {!(searchAlbums.length === 0) ? (
                                    <Button className={styles.button_custom} onClick={handleAddAlbum}>
                                        <PlaylistAddIcon />
                                        앨범 생성하기
                                    </Button>
                                ) : null}
                            </div>
                        </>
                    )}

                </div>

            </div>
        </div>
    );
}

export default MyAlbums;
