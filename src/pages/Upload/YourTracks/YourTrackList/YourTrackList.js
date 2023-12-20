import axios from "axios";
import { useEffect, useContext, useState } from "react";
import { Avatar, Typography } from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import styles from "./YourTrackList.module.css"
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RepeatIcon from '@mui/icons-material/Repeat';
import {
    AutoPlayContext,
    CurrentTrackContext,
    LoginContext,
    MusicContext,
    PlayingContext,
    TrackContext,
    TrackInfoContext,
} from "../../../../App";
import { Link, useParams } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ShareIcon from '@mui/icons-material/Share';
import UpdateModal from "../UpdateModal/UpdateModal";
import Modal from '@mui/material/Modal';



const YourTrackList = () => {
    const { } = useParams();
    const [track, setTrack] = useState([]);
    const { audioFiles, setAudioFiles } = useContext(MusicContext);
    const { isPlaying, setIsPlaying } = useContext(PlayingContext);
    const { currentTrack, setCurrentTrack } = useContext(CurrentTrackContext);
    const { track_info, setTrack_info } = useContext(TrackInfoContext);
    const { tracks, setTracks } = useContext(TrackContext);
    const { loginID, setLoginID } = useContext(LoginContext);
    const { autoPlayAfterSrcChange, setAutoPlayAfterSrcChange } = useContext(AutoPlayContext);
    const [trackPlayingStatus, setTrackPlayingStatus] = useState({});

    const [selectedTrack, setSelectedTrack] = useState(null);

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


    // 업데이트를 반영하기 위한 함수
    const handleTrackUpdated = (updatedTrack) => {
        setTrack((prevTracks) => {
          return prevTracks.map((t) => {
            if (t.trackId === updatedTrack.trackId) {
              return updatedTrack; // Return updated track data
            }
            return t; // Return unmodified track data
          });
        });
      };


    const handleEditClick = (track) => {
        setSelectedTrack(track);
        console.log(track);
        handleOpen(); // 모달 열기
    };

    useEffect(() => {
        if (!loginID) {
            return;
        }

        axios.get(`/api/track/findById/${loginID}`).then((resp) => {
            const tracksWithImages = resp.data.map((track) => {
                const imagePath = track.trackImages.length > 0 ? track.trackImages[0].imagePath : null;
                return { ...track, imagePath };
            });
            setTrack(tracksWithImages);
        });
    }, [track,loginID]);

    const addTrackToPlaylist = (track) => {

        axios.post(`/api/cplist`, {
            trackId: track.trackId,
            id: loginID
        }).then(resp => {

        })

        setAutoPlayAfterSrcChange(true);

        // 트랙에서 관련 정보 추출
        const { filePath, imagePath, title, writer } = track;
        // TrackInfoContext를 선택한 트랙 정보로 업데이트
        setTrack_info({
            filePath,
            imagePath,
            title,
            writer,
        });

        setTracks((prevTracks) => [track, ...prevTracks]);

        setTrackPlayingStatus((prevStatus) => ({
            ...prevStatus,
            [track.trackId]: true,
        }));

        // 현재 트랙을 중지하고 새 트랙을 재생 목록에 추가하고 재생 시작
        setAudioFiles((prevAudioFiles) => [`/tracks/${filePath}`, ...prevAudioFiles]);
        setCurrentTrack(0);
        setIsPlaying(true);
    };


    // 선택한 id값의 음원 정보를 삭제하는 기능
    const handleDelete = (trackId) => {
        console.log("뭐임" + trackId);
        axios.delete(`/api/track/${trackId}`).then(resp => {
            console.log("삭제 성공..")
        }).catch(resp => {
            console.log("삭제 실패...")
        })
    }


    return (
        <div className={styles.container}>
            {track.map((trackone, index) => (
                <div className={styles.track_info} key={index}>
                    <Link to={`/Detail/${trackone.trackId}`} className={styles.linkContainer}>
                        <div className={styles.track_image}>
                            <Avatar
                                alt="Remy Sharp"
                                src={`/tracks/image/${trackone.imagePath}`}
                                sx={{ width: '80px', height: '80px' }}
                            />
                        </div>
                        <div className={styles.track_title}>
                            <div>
                                <Typography variant="h5" gutterBottom>
                                    {trackone.title}
                                </Typography>
                            </div>
                            <div>
                                {trackone.writer}
                            </div>
                        </div>
                    </Link>
                    <div className={styles.play_button}
                        onClick={() => addTrackToPlaylist(trackone)} // div를 클릭할 때마다 호출됨
                    >
                        <PlayArrowIcon sx={{ width: '60px', height: '60px' }} />
                    </div>
                    <div className={styles.track_duration}>
                        {formatDurationFromHHMMSS(trackone.duration)}
                    </div>
                    <div className={styles.buttoncontainer}>
                        <div className={styles.buttonbox}>
                            <div>
                                <ShareIcon className={styles.largeIcon} />
                            </div>

                            <div>
                                <MoreHorizIcon className={styles.largeIcon} />
                            </div>

                            <div>
                                <EditIcon className={styles.largeIcon} onClick={() => handleEditClick(trackone)} />
                                {selectedTrack && (
                                    <Modal
                                        open={open}
                                        onClose={() => {
                                            handleClose();
                                            setSelectedTrack(null); // 모달이 닫힐 때 선택된 트랙 초기화
                                        }}
                                        aria-labelledby="modal-modal-title"
                                        aria-describedby="modal-modal-description"
                                    >
                                        <UpdateModal
                                            selectedTrack={selectedTrack}
                                            setSelectedTrack={setSelectedTrack}
                                            setTrack={setTrack}
                                            onTrackUpdated={handleTrackUpdated}
                                            onClose={handleClose}
                                        />
                                    </Modal>
                                )}
                            </div>
                            <div>
                                <DeleteIcon className={styles.largeIcon}onClick={() => handleDelete(trackone.trackId)} />
                            </div>
                        </div>
                    </div>

                    <div className={styles.like_share}>
                        <div className={styles.like}>
                            <FavoriteBorderIcon />
                            16.9K
                        </div>
                        <div className={styles.share}>
                            <RepeatIcon />
                            368
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const formatDurationFromHHMMSS = (duration) => {
    const [hours, minutes, seconds] = duration.split(':');
    return `${hours}:${minutes}:${seconds}`;
};

export default YourTrackList;
