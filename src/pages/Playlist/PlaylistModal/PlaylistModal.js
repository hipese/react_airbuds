import React, { useContext, useEffect, useState } from 'react';
import styles from './PlaylistModal.module.css';
import axios from 'axios';
import shuffle from '../assets/shuffle.svg'
import { AutoPlayContext, CurrentTrackContext, LoginContext, MusicContext, PlayingContext, TrackContext, TrackInfoContext } from '../../../App';

const Modal = ({ showModal, closeModal, playlist, onPlaylistDeleted, setSelectedPlaylist }) => {
    const [formattedTracks, setFormattedTracks] = useState([]);
    const [tracksWithImages, setTracksWithImages] = useState([]);
    const [totalDuration, setTotalDuration] = useState('');
    const [trackCount, setTrackCount] = useState(0);
    const [playlistTitle, setPlaylistTitle] = useState('');
    const [playlistVisibility, setPlaylistVisibility] = useState('');
    const [isEditMode, setIsEditMode] = useState(false); // New state for edit mode
    const { audioFiles, setAudioFiles } = useContext(MusicContext);
    const { isPlaying, setIsPlaying } = useContext(PlayingContext);
    const { currentTrack, setCurrentTrack } = useContext(CurrentTrackContext);
    const { track_info, setTrack_info } = useContext(TrackInfoContext);
    const { tracks, setTracks } = useContext(TrackContext);
    const { autoPlayAfterSrcChange, setAutoPlayAfterSrcChange } = useContext(AutoPlayContext);
    const { loginID, setLoginID } = useContext(LoginContext);

    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = 'hidden';
            const formatted = playlist.playlistTracks.map(track => ({
                ...track,
                playlistDuration: formatDuration(track.playlistDuration)
            }));
            setFormattedTracks(formatted);

            const images = uniqueImages(formatted.filter(track => track && track.playlistImagePath));
            setTracksWithImages(images);
            setTrackCount(playlist.playlistTracks.length);
            setTotalDuration(getTotalDurationInHoursAndMinutes(playlist.playlistTracks));
        } else {
            document.body.style.overflow = 'unset';
        }
        if (showModal && isEditMode) {
            setPlaylistTitle(playlist.playlistPlTitle);
            setPlaylistVisibility(playlist.playlistVisibility);
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showModal, playlist, isEditMode]);
    if (!showModal) return null;

    const formatDuration = (duration) => {
        const parts = duration.split(':').map(Number);
        const hours = parts.length === 3 && parts[0] !== 0 ? `${parts[0]}:` : '';
        const minutes = parts.length === 3 ? parts[1].toString() : parts[0].toString();
        const seconds = (parts.length === 3 ? parts[2] : parts[1]).toString().padStart(2, '0');

        return `${hours}${minutes}:${seconds}`;
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

    const images = tracksWithImages.length > 0 ? tracksWithImages.slice(0, 4) : [];
    const imgContainerClass = images.length === 4 ? styles.modalImgContainerGrid : styles.modalImgContainerSingle;

    const handleDelete = (playlist) => {
        axios.delete(`/api/playlist/${playlist.playlistSeq}`).then((res) => {
            closeModal();
            if (onPlaylistDeleted) {
                onPlaylistDeleted();
            }
        }).catch((err) => {
            console.log(err);
        });
    };

    const handlePlaylistDeleted = (trackId) => {
        axios.delete(`/api/playlist/track/${trackId}`).then((res) => {
            if (onPlaylistDeleted) {
                onPlaylistDeleted();
            }
            const updatedTracks = formattedTracks.filter(track => track.playlistSeq !== trackId);
            setFormattedTracks(updatedTracks);
            const updatedImages = uniqueImages(updatedTracks.filter(track => track.playlistImagePath));
            setTracksWithImages(updatedImages);
            setTrackCount(updatedTracks.length);
            setTotalDuration(getTotalDurationInHoursAndMinutes(updatedTracks));
        }).catch((err) => {
            console.log(err);
        });
    };

    const handleUpdate = (playlist) => {
        if (playlistTitle !== null || playlistVisibility !== null) {
            axios
                .put(`/api/playlist/update/${playlist.playlistSeq}`, {
                    playlistPlTitle: playlistTitle,
                    playlistVisibility: playlistVisibility,
                })
                .then((res) => {
                    setSelectedPlaylist((prev) => ({
                        ...prev,
                        playlistPlTitle: playlistTitle,
                        playlistVisibility: playlistVisibility,
                    }));
                    setFormattedTracks((prevTracks) => {
                        const updatedTracks = prevTracks.map((track) =>
                            track.playlistSeq === playlist.playlistSeq
                                ? { ...track, playlistPlTitle: playlistTitle }
                                : track
                        );
                        return updatedTracks;
                    });
                    setIsEditMode(false);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'playlistTitle') {
            setPlaylistTitle(value);
        } else if (name === 'playlistVisibility') {
            setPlaylistVisibility(value);
        }
    };

    const addTrackToPlaylist = (track) => {
        const newTracks = track.map((track) => {
            setAutoPlayAfterSrcChange(true);

            // Extract relevant information from the track object and create a new structure
            const newTrack = {
                trackId: track.playlistTrackId,
                filePath: track.playlistFilePath,
                imagePath: track.playlistImagePath,
                title: track.playlistTitle,
                writer: track.playlistWriter,
            };

            return newTrack;
        });

        const { playlistTrackId, playlistFilePath, playlistImagePath, playlistTitle, playlistWriter } = track[0];
        setTrack_info({
            trackId: playlistTrackId,
            filePath: playlistFilePath,
            imagePath: playlistImagePath,
            title: playlistTitle,
            writer: playlistWriter,
        });

        axios.post(`/api/cplist`, {
            trackId: playlistTrackId,
            id: loginID
        }).then(resp => {

        })

        const newAudioFiles = track.map(track => `${track.playlistFilePath}`);

        setAutoPlayAfterSrcChange(true);

        // 현재 트랙을 중지하고 새 트랙을 재생 목록에 추가하고 재생 시작
        setAudioFiles((prevAudioFiles) => [...newAudioFiles, ...prevAudioFiles]);
        setCurrentTrack(0);
        setIsPlaying(true);

        // Update the state with the new array of tracks
        setTracks((prevTracks) => [...newTracks, ...prevTracks]);
        closeModal();
    };

    const addTrackToPlaylistRandom = (track) => {
        const shuffledTracks = shuffleArray(track); // Shuffle the tracks array

        const newTracks = shuffledTracks.map((track) => {
            setAutoPlayAfterSrcChange(true);

            // Extract relevant information from the track object and create a new structure
            const newTrack = {
                trackId: track.playlistTrackId,
                filePath: track.playlistFilePath,
                imagePath: track.playlistImagePath,
                title: track.playlistTitle,
                writer: track.playlistWriter,
            };

            return newTrack;
        });

        const { playlistTrackId, playlistFilePath, playlistImagePath, playlistTitle, playlistWriter } = shuffledTracks[0];
        setTrack_info({
            trackId: playlistTrackId,
            filePath: playlistFilePath,
            imagePath: playlistImagePath,
            title: playlistTitle,
            writer: playlistWriter,
        });

        axios.post(`/api/cplist`, {
            trackId: playlistTrackId,
            id: loginID
        }).then(resp => {
            // Handle response if needed
        });

        const newAudioFiles = shuffledTracks.map(track => `${track.playlistFilePath}`);

        setAutoPlayAfterSrcChange(true);

        // 현재 트랙을 중지하고 새 트랙을 재생 목록에 추가하고 재생 시작
        setAudioFiles((prevAudioFiles) => [...newAudioFiles, ...prevAudioFiles]);
        setCurrentTrack(0);
        setIsPlaying(true);

        // Update the state with the new array of tracks
        setTracks((prevTracks) => [...newTracks, ...prevTracks]);
        closeModal();
    };

    // Function to shuffle an array
    const shuffleArray = (array) => {
        const shuffledArray = [...array];
        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
        }
        return shuffledArray;
    };
    

    return (
        <div className={styles.modal} onClick={closeModal}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={closeModal}>×</button>
                <div className={styles.modalHeader}>
                    <div className={imgContainerClass}>
                        {tracksWithImages.length > 0 ? (
                            imgContainerClass === styles.modalImgContainerGrid ? (
                                images.map((track, imgIndex) => (
                                    <img
                                        key={imgIndex}
                                        className={styles.modalImg}
                                        src={`${track.playlistImagePath}`}
                                        alt={track.playlistTitle || '플레이리스트 이미지'}
                                    />
                                ))
                            ) : (
                                <img
                                    className={styles.modalImg}
                                    src={`${images[0].playlistImagePath}`}
                                    alt={images[0].playlistTitle || '플레이리스트 이미지'}
                                />
                            )
                        ) : (
                            <div className={styles.noImage}>이미지 없음</div>
                        )}
                    </div>
                    <div className={styles.modalDetailHeader}>
                        <div className={styles.modalTitle}>
                            {isEditMode ? (
                                <input type="text" name="playlistTitle" value={playlistTitle} onChange={handleChange} />
                            ) : (
                                <>
                                    {playlist.playlistPlTitle}
                                </>
                            )}
                        </div>
                        <div className={styles.modalDetailContents}>
                            <div className={styles.modalTrackCount}>트랙 {trackCount}개</div>
                            <div className={styles.modalDivider}>•</div>
                            <div className={styles.modalDuration}>총 {totalDuration}</div>
                        </div>
                        <div className={styles.modalVisibility}>
                            {isEditMode ? (
                                <>
                                    <input type="radio" name="playlistVisibility" value="public" checked={playlistVisibility === 'public'} onChange={handleChange} />
                                    Public
                                    <input type="radio" name="playlistVisibility" value="private" checked={playlistVisibility === 'private'} onChange={handleChange} />
                                    Private
                                </>
                            ) : (
                                <>
                                    {playlist.playlistVisibility}
                                </>
                            )}
                        </div>
                        <div className={styles.shuffle} onClick={() => addTrackToPlaylistRandom(playlist.playlistTracks)}>
                            <img src={shuffle} alt="" width={"20px"} height={"20px"} />셔플
                        </div>
                        <div className={styles.modalButtons}>
                            <button className={styles.playbutton} onClick={() => addTrackToPlaylist(playlist.playlistTracks)}>재생</button>
                            {isEditMode ? (
                                <>
                                    <button
                                        className={styles.modifiedBtn}
                                        onClick={() => {
                                            handleUpdate(playlist);
                                            setIsEditMode(false);
                                        }}
                                    >
                                        완료
                                    </button>
                                    <button
                                        className={styles.deleteBtn}
                                        onClick={() => {
                                            setPlaylistTitle(playlist.playlistPlTitle);
                                            setPlaylistVisibility(playlist.playlistVisibility);
                                            setIsEditMode(false);
                                        }}
                                    >
                                        취소
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        className={styles.modifiedBtn}
                                        onClick={() => {
                                            setIsEditMode(true);
                                        }}
                                    >
                                        수정
                                    </button>
                                    <button
                                        className={styles.deleteBtn}
                                        onClick={() => handleDelete(playlist)}
                                    >
                                        삭제
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                    
                </div>
                <div className={styles.modalBody}>
                    <ul className={styles.modalTrackList}>
                        {formattedTracks.map((track, index) => (
                            <li className={styles.modalTrack} key={index}>
                                <div className={styles.modalTrackImg}>
                                    <img src={`${track.playlistImagePath}`} alt="track" />
                                </div>
                                <div className={styles.modalTrackInfo}>
                                    <div className={styles.modalTrackTitle}>{track.playlistTitle}</div>
                                    <div className={styles.modalTrackWriter}>{track.playlistWriter}</div>
                                </div>
                                <div className={styles.modalTrackDuration}>{formatDuration(track.playlistDuration)}</div>
                                <button className={styles.modalTrackDelete} onClick={() => handlePlaylistDeleted(track.playlistSeq)}>×</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Modal;

const convertDurationToSeconds = (duration) => {
    if (!duration || duration.split(':').length < 2) {
        return 0;
    }
    const parts = duration.split(':').map(Number);
    const seconds = parts.pop(); // 마지막 요소 (초) 추출
    const minutes = parts.pop() || 0; // 뒤에서 두 번째 요소 (분) 추출, 없으면 0
    const hours = parts.pop() || 0; // 남은 요소 (시간) 추출, 없으면 0

    return hours * 3600 + minutes * 60 + seconds;
};
const getTotalDurationInHoursAndMinutes = (tracks) => {
    const totalSeconds = tracks.reduce((total, track) => {
        const durationSeconds = convertDurationToSeconds(track.playlistDuration);
        return total + (isNaN(durationSeconds) ? 0 : durationSeconds);
    }, 0);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.ceil((totalSeconds % 3600) / 60);

    let formattedDuration = "";
    if (hours > 0) {
        formattedDuration += `${hours}시간 `;
    }
    formattedDuration += `${minutes}분`;

    return formattedDuration;
};