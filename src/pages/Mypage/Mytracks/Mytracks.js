import axios from "axios";
import { useEffect, useContext, useState } from "react";
import { Avatar, Typography } from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import styles from "./Mytracks.module.css";
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
} from "../../../App";
import { Link, useParams } from "react-router-dom";
import WaveSurferPlayer from "../../Components/WaveSurferPlayer";
import heart from "../assets/heart.svg";

const Mytracks = () => {
    const { loginId } = useParams();
    const [track, setTrack] = useState([]);
    const { audioFiles, setAudioFiles } = useContext(MusicContext);
    const { isPlaying, setIsPlaying } = useContext(PlayingContext);
    const { currentTrack, setCurrentTrack } = useContext(CurrentTrackContext);
    const { track_info, setTrack_info } = useContext(TrackInfoContext);
    const { tracks, setTracks } = useContext(TrackContext);
    const { loginID, setLoginID } = useContext(LoginContext);
    const { autoPlayAfterSrcChange, setAutoPlayAfterSrcChange } = useContext(AutoPlayContext);
    const [trackPlayingStatus, setTrackPlayingStatus] = useState({});
    const localItem = localStorage.getItem("loginID");
    const storageId = JSON.parse(localItem);
    const [isFavorite, setFavorite] = useState(0);
    const [trackLike,setLike] = useState([]);
    const [trackCount,setTrackCount] = useState([]);

    useEffect(() => {
        if (!loginID) {
            return;
        }

        axios.get(`/api/track/findById/${loginId}`).then((resp) => {
            const tracksWithImages = resp.data.map((track) => {
                const imagePath = track.trackImages.length > 0 ? track.trackImages[0].imagePath : null;
                return { ...track, imagePath };
            });
            setTrack(tracksWithImages);
        });
    }, [loginID]);

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

    const handleFavorite = (trackId, isLiked,e) => {
        if(loginID !== ""){
            if(!isLiked){
                const formData = new FormData();
                formData.append("likeSeq",0);
                formData.append("userId",storageId.value);
                formData.append("trackId",trackId);                
                axios.post(`/api/like`,formData).then(res=>{
                    setLike([...trackLike, { trackId : trackId, userId: storageId.value, likeSeq: res.data}]);
                    setFavorite(isFavorite+1);
                    e.target.classList.add(styles.onClickHeart);
                    e.target.classList.remove(styles.NonClickHeart);
                }).catch((e)=>{
                    console.log(e);
                });
            }else{
                const deleteData = new FormData();
                deleteData.append("trackId",trackId);
                deleteData.append("userId",storageId);
                axios.post(`/api/like/delete`,deleteData).then(res=>{
                    const newLikeList = trackLike.filter(e => e.trackId !== trackId);
                    console.log("carousel delete",newLikeList);
                    setLike(newLikeList);
                    setFavorite(isFavorite+1);
                    e.target.classList.remove(styles.onClickHeart);
                    e.target.classList.add(styles.NonClickHeart);
                }).catch((e)=>{
                    console.log(e);
                });            
            }
        }else{
            alert("좋아요는 로그인을 해야 합니다.")
            return;
        }
    }

    const getLikeCount = (trackId) => {
        const targetCount = trackCount.find(item => item.trackId === trackId);
        return targetCount ? targetCount.count : 0;
    };
    
    const loadingLikes = async () => {
        axios.get(`/api/like/${storageId.value}`).then(res=>{
            console.log(res.data);
            setLike(res.data);            
        }).catch((e)=>{
            console.log(e);
        });

        axios.get(`/api/track/like_count/${loginId}`).then(res=>{
            setTrackCount(res.data);
        }).catch((e)=>{
            console.log(e);
        });
    }

    useEffect(()=>{
        loadingLikes();
    },[isFavorite]);

    return (
        <div className={styles.container}>
            {track.map((track, index) => (
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
                    <div className={styles.play_button}
                        onClick={() => addTrackToPlaylist(track)} // div를 클릭할 때마다 호출됨
                    >
                        <PlayArrowIcon sx={{ width: '60px', height: '60px' }} />
                    </div>
                    <div className={styles.track_duration}>
                        {formatDurationFromHHMMSS(track.duration)}
                    </div>
                    <div className={styles.like_share}>
                        <div className={styles.like}>
                            {/* <FavoriteBorderIcon /> */}
                            <img 
                                src={heart} 
                                alt="" 
                                className={
                                    trackLike.some(trackLike => trackLike.trackId === track.trackId) 
                                    ? styles.onClickHeart : styles.NonClickHeart} 
                                onClick={(e)=>{handleFavorite(track.trackId,trackLike.some(trackLike => trackLike.trackId === track.trackId),e)}}/>
                                {" "+getLikeCount(track.trackId)}
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

export default Mytracks;
