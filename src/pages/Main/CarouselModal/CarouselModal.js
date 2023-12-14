import React, {useEffect, useState} from 'react';
import styles from './CarouselModal.module.css';
import X from '../assets/x.png';
import axios from 'axios';

const CarouselModal = ({ onClose, trackInfo }) => {
    const [playlistTitle, setPlaylistTitle] = useState("");
    const [playlistVisibility, setPlaylistVisibility] = useState('public');
    
    const handleTitleChange = (e) => {
        setPlaylistTitle(e.target.value);
    };

    const handleVisibilityChange = (e) => {
        setPlaylistVisibility(e.target.value);
    };

    const handleSubmit = async () => {
        const playlistData = {
            playlistPlTitle: playlistTitle,
            playlistVisibility: playlistVisibility,
            playlistTrackId: trackInfo.track.trackId,
            playlistTitle: trackInfo.track.title,
            playlistImagePath: trackInfo.track.trackImages[0].imagePath,
            playlistDuration: trackInfo.track.duration,
            playlistFilePath: trackInfo.track.filePath,
            playlistWriteId: trackInfo.track.writeId,
            playlistWriter: trackInfo.track.writer,
        }
        try {
            const response = await axios.post("/api/playlist", playlistData);
            console.log(response);
            onClose();
        } catch (err) {
            console.log("Error Sending Playlist Data: ", err);
        }
    }

    return (
        <div className={styles.modalBackground}>
            <div className={styles.modalContent}>
                <div className={styles.modalClose} onClick={onClose}><img src={X} alt="" /></div>
                <ul className={styles.modalTitle}>
                    <li className={styles.playlistCreate}>플레이리스트 생성</li>
                    <li className={styles.playlistAdd}>플레이리스트 추가</li>
                </ul>
                <div className={styles.playlistTitle}>
                    <div className={styles.plTitle}>플레이리스트 제목 <span>*</span></div>
                    <div className={styles.plTitleInput}><input type="text" placeholder='제목 추가하기' value={playlistTitle} onChange={handleTitleChange} /></div>
                </div>
                <div className={styles.playlistShare}>
                    <div className={styles.plShare}>공개 여부 : </div>
                    <input type="radio" id="public" value="public" name="playlistVisibility" checked={ playlistVisibility === 'public' } onChange={handleVisibilityChange}/><label htmlFor="public">전체 공개</label>
                    <input type="radio" id="private" value="private" name="playlistVisibility" checked={ playlistVisibility === 'private' } onChange={handleVisibilityChange}/><label htmlFor="private">비공개</label>
                    <button className={styles.submitBtn} onClick={handleSubmit}>저장</button>
                </div>
                <ul className={styles.addPlaylist}>
                    <li className={styles.playlist}>
                        <div className={styles.playlistiwt}>
                            <div className={styles.playlistImg}>
                                <img src={`/tracks/image/${trackInfo.track.trackImages[0].imagePath}`} alt="" />
                            </div>
                            <div className={styles.playlistWriterModal}>{trackInfo.track.writer}</div>
                            <span>-</span>
                            <div className={styles.playlistTitleModal}>{trackInfo.track.title}</div>
                        </div>
                        <div ></div>
                    </li>
                    <li className={styles.playlist}></li>
                    <li className={styles.playlist}></li>
                    <li className={styles.playlist}></li>
                    <li className={styles.playlist}></li>
                </ul>
                <div className={styles.playlistHr}></div>
                {/* <div className={styles.playlistLike}>
                    <div className={styles.pllikeTitle}>좋아요 한 노래</div>
                </div> */}
            </div>
        </div>
    );
};

export default CarouselModal;