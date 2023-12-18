import React, { useEffect, useState, useContext } from 'react';
import styles from './CarouselModal.module.css';
import X from '../assets/x.png';
import axios from 'axios';
import { LoginContext } from "../../../App";
import GroupAddIcon from '@mui/icons-material/GroupAdd';

const CarouselModal = ({ onClose, trackInfo, trackLike, trackInfoAll }) => {
    const [isClosing, setIsClosing] = useState(false);
    const [playlistTitle, setPlaylistTitle] = useState("");
    const [playlistVisibility, setPlaylistVisibility] = useState('public');
    const [selectedTab, setSelectedTab] = useState('playlistCreate');
    const [onlyLike, setOnlyLike] = useState([]);
    const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
    const handleCreatePlaylist = () => {
        setIsCreatingPlaylist(true);
        setSelectedTab('playlistCreate');
    };
    const handleAddPlaylist = () => {
        setIsCreatingPlaylist(false);
        setSelectedTab('playlistAdd');
    };
    useEffect(() => {
        setIsCreatingPlaylist(true);
    }, []);

    const initialPlaylistTrack = [
        {
            playlistTrackId: trackInfo.track.trackId,
            playlistTitle: trackInfo.track.title,
            playlistImagePath: trackInfo.track.trackImages[0].imagePath,
            playlistDuration: trackInfo.track.duration,
            playlistFilePath: trackInfo.track.filePath,
            playlistWriter: trackInfo.track.writer
        },
        {}, {}, {} // 빈 객체로 나머지 세 개의 트랙을 초기화
    ];

    const [playlistTrack, setPlaylistTrack] = useState(initialPlaylistTrack);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        }
    }, []);

    useEffect(() => {
        if (Array.isArray(trackLike)) {
            const sortedTrackLikes = [...trackLike].sort((a, b) => b.likeSeq - a.likeSeq);
            let matchedTracks = [];
            let index = 0;

            while (matchedTracks.length < 3 && index < sortedTrackLikes.length) {
                const trackIdToFind = sortedTrackLikes[index].trackId;

                if (trackIdToFind !== trackInfo.track.trackId) {
                    const trackInfo = trackInfoAll.find(infoItem => infoItem.trackId === trackIdToFind);

                    if (trackInfo) {
                        matchedTracks.push(trackInfo);
                    }
                }

                index++;
            }

            setOnlyLike(matchedTracks);
        }
    }, [trackLike, trackInfoAll, trackInfo]);

    const handleModalClick = (e) => {
        e.stopPropagation();
    };

    const handleTitleChange = (e) => {
        setPlaylistTitle(e.target.value);
    };

    const handleVisibilityChange = (e) => {
        setPlaylistVisibility(e.target.value);
    };

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
        }, 500);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        if (!playlistTitle) return alert("플레이리스트 제목을 입력해주세요.");

        const playlistData = {
            playlistPlTitle: playlistTitle,
            playlistVisibility: playlistVisibility,
            playlistTrack: playlistTrack.filter(track => track.playlistTrackId) // 비어 있지 않은 트랙만 필터링
        };

        try {
            await axios.post("/api/playlist", playlistData);
            onClose();
        } catch (err) {
            console.log("Error Sending Playlist Data: ", err);
        }
    };

const handleAddClick = (trackToAddId) => {
    const trackToAdd = trackInfoAll.find(infoItem => infoItem.trackId === trackToAddId);
    const isTrackAlreadyAdded = playlistTrack.some(track => track.playlistTrackId === trackToAddId);

    if (isTrackAlreadyAdded) {
        // 트랙을 제거하는 경우
        const newPlaylistTrack = playlistTrack.filter(track => track.playlistTrackId !== trackToAddId);
        // 제거된 트랙 뒤의 모든 트랙을 앞으로 당김
        newPlaylistTrack.push({}); // 마지막에 빈 객체 추가
        if (newPlaylistTrack.length > 4) {
            newPlaylistTrack.pop(); // 배열이 네 개를 초과하면 마지막 요소 제거
        }
        setPlaylistTrack(newPlaylistTrack);
    } else {
        // 새 트랙을 추가하는 경우
        let added = false;
        const newPlaylistTrack = playlistTrack.map(track => {
            if (!track.playlistTrackId && !added) {
                added = true; // 새 트랙을 추가했음을 표시
                return {
                    playlistTrackId: trackToAdd.trackId,
                    playlistTitle: trackToAdd.title,
                    playlistImagePath: trackToAdd.trackImages[0].imagePath,
                    playlistDuration: trackToAdd.duration,
                    playlistFilePath: trackToAdd.filePath,
                    playlistWriter: trackToAdd.writer
                };
            }
            return track;
        });

        if (!added) return;

        setPlaylistTrack(newPlaylistTrack);
    }
};
    



    return (
        <div className={styles.modalBackground} onClick={handleClose}>
            <div className={`${isClosing ? styles.modalContentClosing : styles.modalContent}`} onClick={handleModalClick}>
                <div className={styles.modalClose} onClick={handleClose}><img src={X} alt="" /></div>
                <ul className={styles.modalTitle}>
                    <li className={`${styles.playlistCreate} ${selectedTab === 'playlistCreate' ? styles.selectedTab : ''}`} onClick={handleCreatePlaylist}>플레이리스트 생성</li>
                    <li className={`${styles.playlistAdd} ${selectedTab === 'playlistAdd' ? styles.selectedTab : ''}`} onClick={handleAddPlaylist}>플레이리스트 추가</li>
                </ul>
                {isCreatingPlaylist ? (
                    <>
                        <div className={styles.playlistTitle}>
                            <div className={styles.plTitle}>플레이리스트 제목 <span>*</span></div>
                            <div className={styles.plTitleInput}><input type="text" placeholder='제목 추가하기' value={playlistTitle} onChange={handleTitleChange} onKeyPress={handleKeyPress}/></div>
                        </div>
                        <div className={styles.playlistShare}>
                            <div className={styles.plShare}>공개 여부 : </div>
                            <input type="radio" id="public" value="public" name="playlistVisibility" checked={ playlistVisibility === 'public' } onChange={handleVisibilityChange}/><label htmlFor="public">전체 공개</label>
                            <input type="radio" id="private" value="private" name="playlistVisibility" checked={ playlistVisibility === 'private' } onChange={handleVisibilityChange}/><label htmlFor="private">비공개</label>
                            <button className={styles.submitBtn} onClick={handleSubmit}>저장</button>
                        </div>
                        <ul className={styles.addPlaylist}>
                            {playlistTrack.map((track, index) => {
                                if (track.playlistTrackId) {
                                    // 실제 트랙 정보가 있는 경우
                                    return (
                                        <li key={index} className={styles.playlist}>
                                            <div className={styles.playlistiwt}>
                                                <div className={styles.playlistImg}>
                                                    <img src={`/tracks/image/${track.playlistImagePath}`} alt={track.playlistTitle} />
                                                </div>
                                                <div className={styles.playlistWriterModal}>{track.playlistWriter}</div>
                                                <span>-</span>
                                                <div className={styles.playlistTitleModal}>{track.playlistTitle}</div>
                                            </div>
                                        </li>
                                    );
                                } else {
                                    // 빈 객체인 경우 (아직 트랙이 추가되지 않음)
                                    return (
                                        <li key={index} className={styles.playlist}>
                                            {/* 빈 트랙에 대한 렌더링 로직 (예: "트랙 추가" 메시지 또는 아이콘) */}
                                        </li>
                                    );
                                }
                            })}
                        </ul>
                    

                        {/* 추천하는 노래 목록 */}
                        <div className={styles.playlistLike}>
                            <div className={styles.pllikeTitle}>추천하는 노래</div>
                        </div>

                        <ul className={styles.likeMusic}>
                            {onlyLike.map((like, index) => {
                                const isAdded = playlistTrack.some(track => track.playlistTrackId === like.trackId);
                                const buttonClass = isAdded ? styles.likeAddBtns : styles.likeAddBtn;

                                return (
                                    <li key={index} className={styles.likeMusicLi}>
                                        <div className={styles.likeMusicImg}>
                                            <img src={`/tracks/image/${like.trackImages[0].imagePath}`} alt={like.title} />
                                        </div>
                                        <div className={styles.likeWriterAndTitle}>
                                            <div className={styles.likeMusicWriter}>{like.writer}</div>
                                            <div className={styles.likeMusicTitle}>{like.title}</div>
                                        </div>
                                        <div className={styles.likeAdd}>
                                            <button className={buttonClass} onClick={() => handleAddClick(like.trackId)}>
                                                <GroupAddIcon className={styles.groupAdd} />추가
                                            </button>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </>
                ) : (
                    <div></div>
                )}
        </div>
    </div>
    );
};

export default CarouselModal;