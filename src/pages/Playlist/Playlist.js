import react, {useEffect, useState, useContext} from "react";
import styles from "./Playlist.module.css";
import axios from "axios";
import { LoginContext } from "../../App";
import Modal from "./PlaylistModal/PlaylistModal";

const Playlist = () => {
    const [playlist, setPlaylist] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const { loginID } = useContext(LoginContext);

    const fetchPlaylists = () => {
        axios.get(`/api/playlist/${loginID}`).then((res) => {
            setPlaylist(res.data);
        }).catch((err) => {
            console.log(err);
        });
    };
    useEffect(() => {
        if (loginID !== "") {
            fetchPlaylists();
        }
    }, [loginID]);
    const handlePlaylistDeleted = () => {
        fetchPlaylists();
    };

    const uniqueImages = (tracks) => {
        const uniquePaths = new Set();
        return tracks.filter(track => {
            if (!uniquePaths.has(track.playlistImagePath)) {
                uniquePaths.add(track.playlistImagePath);
                return true;
            }
            return false;
        });
    };

    const openModal = (playlist) => {
        setSelectedPlaylist(playlist);
        setShowModal(true);
    }
    const closeModal = () => {
        setShowModal(false);
    }
    

    return (
        <div className={styles.container}>
            <div className={styles.contentContainer}>
                <h1>내 플레이리스트</h1>
                <ul className={styles.playlistContent}>
                    {playlist.map((list, index) => {
                        const tracksWithImages = uniqueImages(list.playlistTracks.filter(track => track && track.playlistImagePath));
                        const images = tracksWithImages.length > 0 ? tracksWithImages.slice(0, 4) : [];
                        const imgContainerClass = images.length === 4 ? styles.playlistImgContainer : styles.playlistImgContainerSingle;
                        return (
                            <li className={styles.playlist} key={index} onClick={() => openModal(list)}>
                                <div className={imgContainerClass}>
                                    {images.length > 0 ? (
                                        imgContainerClass === styles.playlistImgContainer ? (
                                            images.map((track, imgIndex) => (
                                                <img 
                                                    key={imgIndex} 
                                                    className={styles.playlistImg}
                                                    src={`/tracks/image/${track.playlistImagePath}`} 
                                                    alt={track.playlistTitle || '플레이리스트 이미지'} 
                                                />
                                            ))
                                        ) : (
                                            <img 
                                                className={styles.playlistImg}
                                                src={`/tracks/image/${images[0].playlistImagePath}`} 
                                                alt={images[0].playlistTitle || '플레이리스트 이미지'} 
                                            />
                                        )
                                    ) : (
                                        <div className={styles.noImage}>이미지 없음</div>
                                    )}
                                </div>
                                <div className={styles.playlistTitle}>{list.playlistPlTitle}</div>
                                <div className={styles.playlistWriter}>
                                    {[...new Set(list.playlistTracks.map(track => track.playlistWriter))]
                                        .map((writer, index, array) => (
                                            <span key={index}>
                                                {writer}{index < array.length - 1 ? ',\u00A0' : ''}
                                            </span>
                                        ))}
                                </div>
                                <div className={styles.playlistLength}><span>재생 목록 : {list.playlistTracks.length}곡</span></div>
                            </li>
                        );
                    })}
                </ul>
            </div>
            <Modal showModal={showModal} closeModal={closeModal} playlist={selectedPlaylist} onPlaylistDeleted={handlePlaylistDeleted} />
        </div>
    );
}

export default Playlist;