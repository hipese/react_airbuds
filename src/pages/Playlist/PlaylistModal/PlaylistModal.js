import React, {useEffect, useState} from 'react';
import styles from './PlaylistModal.module.css';
import axios from 'axios';

const Modal = ({ showModal, closeModal, playlist, onPlaylistDeleted }) => {
    const [formattedTracks, setFormattedTracks] = useState([]);
    const [tracksWithImages, setTracksWithImages] = useState([]);
    const [totalDuration, setTotalDuration] = useState('');
    const [trackCount, setTrackCount] = useState(0);

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
        return () => {
            document.body.style.overflow = 'unset';
        } 
    }, [showModal, playlist]);
    if (!showModal) return null;

    const formatDuration = (duration) => {
        const parts = duration.split(':').map(Number);
        const hours = parts.length === 3 && parts[0] !== 0 ? `${parts[0]}:` : '';
        const minutes = parts.length === 3 ? parts[1].toString() : parts[0].toString();
        const seconds = (parts.length === 3 ? parts[2] : parts[1]).toString().padStart(2, '0');

        return `${hours}${minutes}:${seconds}`;
    };
    // const totalDuration = getTotalDurationInHoursAndMinutes(playlist.playlistTracks);
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
    }
    const handleUpdate = (playlist) => {
        const newTitle = prompt('Enter the new playlist title:', playlist.playlistPlTitle);
    
        if (newTitle !== null) {
            axios.put(`/api/playlist/update/${playlist.playlistSeq}`, { playlistPlTitle: newTitle })
                .then((res) => {

                    setFormattedTracks((prevTracks) => {
                        const updatedTracks = prevTracks.map((track) =>
                            track.playlistSeq === playlist.playlistSeq
                                ? { ...track, playlistPlTitle: newTitle }
                                : track
                        );
                        return updatedTracks;
                    });
                    window.location.reload();
                })
                .catch((err) => {
                    console.log(err);
                });
        }
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
                                        src={`/tracks/image/${track.playlistImagePath}`} 
                                        alt={track.playlistTitle || '플레이리스트 이미지'} 
                                    />
                                ))
                            ) : (
                                <img 
                                    className={styles.modalImg}
                                    src={`/tracks/image/${images[0].playlistImagePath}`} 
                                    alt={images[0].playlistTitle || '플레이리스트 이미지'} 
                                />
                            )
                        ) : (
                            <div className={styles.noImage}>이미지 없음</div>
                        )}
                    </div>
                    <div className={styles.modalDetailHeader}>
                        <div className={styles.modalTitle}>{playlist.playlistPlTitle}</div>
                        <div className={styles.modalDetailContents}>
                            <div className={styles.modalTrackCount}>트랙 {trackCount}개</div>
                            <div className={styles.modalDivider}>•</div>
                            <div className={styles.modalDuration}>총 {totalDuration}</div>
                        </div>
                        <div className={styles.modalVisibility}>{playlist.playlistVisibility}</div>
                        <div className={styles.modalButtons}>
                            <button className={styles.modifiedBtn} onClick={() => handleUpdate(playlist)}>수정</button>
                            <button className={styles.deleteBtn} onClick={() => handleDelete(playlist)}>삭제</button>
                        </div>
                    </div>
                </div>
                <div className={styles.modalBody}>
                    <ul className={styles.modalTrackList}>
                        {formattedTracks.map((track, index) => (
                            <li className={styles.modalTrack} key={index}>
                                <div className={styles.modalTrackImg}>
                                    <img src={`/tracks/image/${track.playlistImagePath}`}  alt="track" />
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