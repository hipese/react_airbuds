import { Col, Row } from "reactstrap";
import styles from "./TrackSearchResult.module.css"
import None_track_info from "../../Components/None_login_info";
import axios from "axios";
import { useEffect, useContext, useState } from "react";
import { Avatar, Typography } from "@mui/material";
import PlayCircleIcon from '@mui/icons-material/PlayCircle';

import {
    AutoPlayContext,
    CurrentTrackContext,
    LoginContext,
    MusicContext,
    PlayingContext,
    TrackContext,
    TrackInfoContext,
} from "../../../App";
import { Link, useParams } from "react-router-dom";
import heart from "../../Mypage/assets/heart.svg";

const TrackSearchResult = ({ searchTracks }) => {

    console.log(searchTracks);

   

    const { targetID } = useParams();
    const { audioFiles, setAudioFiles } = useContext(MusicContext);
    const { isPlaying, setIsPlaying } = useContext(PlayingContext);
    const { currentTrack, setCurrentTrack } = useContext(CurrentTrackContext);
    const { track_info, setTrack_info } = useContext(TrackInfoContext);
    const { tracks, setTracks } = useContext(TrackContext);
    const { loginID, setLoginID } = useContext(LoginContext);
    const { autoPlayAfterSrcChange, setAutoPlayAfterSrcChange } = useContext(AutoPlayContext);
    const [trackPlayingStatus, setTrackPlayingStatus] = useState({});
    const [isFavorite, setFavorite] = useState(0);
    const [trackLike, setLike] = useState([]);
    const [trackCount, setTrackCount] = useState([]);


    const addStreamCount = (trackId, singerId, e) => {
        const formdata = new FormData();
        const date = new Date().toISOString();
        formdata.append("trackId",trackId);
        formdata.append("streamDate",date);
        formdata.append("streamSinger",singerId);
        axios.put(`/api/dashboard/addStream`,formdata).then(res=>{

        }).catch((e)=>{
            console.log(e);
        });
    }

    const addTrackToPlaylist = (track) => {

        axios.post(`/api/cplist`, {
            trackId: track.trackId,
            id: loginID
        }).then(resp => {
            addStreamCount(track.trackId,track.writeId);
        })

        setAutoPlayAfterSrcChange(true);

        // 트랙에서 관련 정보 추출
        const { trackId, filePath, imagePath, title, writer } = track;
        // TrackInfoContext를 선택한 트랙 정보로 업데이트
        setTrack_info({
            trackId,
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




    return (
        <div className={styles.container}>
             <Col sm='12' className={styles.titleText}>
                트랙목록
            </Col>
            {searchTracks.length === 0 ? (
                <None_track_info />
            ) : (
                searchTracks.map((track, index) => (
                    <div className={styles.track_info} key={index}>
                        <Link to={`/Detail/${track.trackId}`} className={styles.linkContainer}>
                            <div className={styles.track_image}>
                                <Avatar
                                    alt="Remy Sharp"
                                    src={`/tracks/image/${track.imagePath}`}
                                    sx={{ width: '80px', height: '80px' }}
                                />
                            </div>
                            <div className={styles.track_title}>
                                <div>
                                    <Typography variant="h5" gutterBottom>
                                        {track.title}
                                    </Typography>
                                </div>
                                <div>
                                    {track.writer}
                                </div>
                            </div>
                        </Link>
                        <div className={styles.track_button}>
                            <div className={styles.play_button}
                                onClick={() => addTrackToPlaylist(track)}
                            >
                                <PlayCircleIcon sx={{ width: '60px', height: '60px' }} />
                            </div>
                            <div className={styles.track_duration}>
                                {formatDurationFromHHMMSS(track.duration)}
                            </div>
                            
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}


const formatDurationFromHHMMSS = (duration) => {
    const [hours, minutes, seconds] = duration.split(':');
    return `${hours}:${minutes}:${seconds}`;
};

export default TrackSearchResult;