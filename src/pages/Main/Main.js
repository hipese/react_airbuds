import React, { useState, useEffect, useContext } from "react";
import styles from "./Main.module.css";
import axios from "axios";
import { Link } from "react-router-dom"
import OwlCarousel from "./Carousel"
import RightSide from "./RightSide/RightSide";
import { AutoPlayContext, CurrentTrackContext, LoginContext, MusicContext, PlayingContext, TrackContext, TrackInfoContext } from "../../App";
import { Box, CircularProgress } from "@mui/material";

const Main = () => {
    const [recentMusic, setRecentMusic] = useState([]);
    const [selectTitle, setSelectTitle] = useState([]);
    const [selectImage, setSelectImage] = useState("");
    const [trackInfoByTag, setTrackInfoByTag] = useState({});
    const [trackLike, setLike] = useState([]);
    const { loginID, setLoginID } = useContext(LoginContext);
    const [isFavorite, setFavorite] = useState(0);
    const [trackInfoAll, setTrackInfoAll] = useState([]);
    const [loading, setLoading] = useState(true);
    const [flag, setFlag] = useState(true);
    const { audioFiles, setAudioFiles } = useContext(MusicContext);
    const { isPlaying, setIsPlaying } = useContext(PlayingContext);
    const { currentTrack, setCurrentTrack } = useContext(CurrentTrackContext);
    const { track_info, setTrack_info } = useContext(TrackInfoContext);
    const { tracks, setTracks } = useContext(TrackContext);
    const { autoPlayAfterSrcChange, setAutoPlayAfterSrcChange } = useContext(AutoPlayContext);



    useEffect(() => {
        axios.get("/api/track/recent")
            .then((res) => {
                const tracksWithImages = res.data.map((track) => {
                    const imagePath = track.trackImages.length > 0 ? track.trackImages[0].imagePath : null;
                    return { ...track, imagePath };
                });
                console.log(tracksWithImages);
                setRecentMusic(tracksWithImages);
                if (res.data.length > 0 && res.data[0].trackImages && res.data[0].trackImages.length > 0) {
                    setSelectImage(res.data[0].trackImages[0].imagePath);
                }
            })
            .catch((err) => {
                console.log(err);
            });

        axios.get("/api/MusicTag")
            .then((res) => {
                if (Array.isArray(res.data)) {
                    setSelectTitle(res.data);
                    setLoading(false);
                } else {
                    setSelectTitle([]);
                    console.log("Data is not an array:", res.data);
                }
            })
            .catch((err) => {
                console.log(err);
                setSelectTitle([]);
            });
        loadingLikes();
    }, [loginID]);

    const loadingLikes = async () => {
        axios.get(`/api/like/${loginID}`).then(res => {
            setLike(res.data);
        }).catch((e) => {
            console.log(e);
        });
    }
    const addVisitCount = () => {
        const formdData = new FormData();
        const date = new Date().toISOString();
        console.log(date);
        formdData.append("visitDate",date);
        axios.put(`/api/dashboard/visit`,formdData).then(res=>{

        }).catch((e)=>{
            console.log(e);
    });

    useEffect(() => {
        loadingLikes();
    }, [isFavorite]);

    useEffect(() => {
        axios.get("/api/track").then((res) => {
            setTrackInfoAll(res.data);
            loadingLikes();
        }).catch((err) => {
            console.log(err);
        });
    }, [isFavorite]);

    useEffect(() => {
        if (Array.isArray(selectTitle)) {
            selectTitle.forEach(tag => {
                if ([5, 6, 8, 9, 10, 12, 13, 14].includes(tag.tagId)) {
                    axios.get("/api/trackTag", { params: { tag: tag.tagId } })
                        .then((res) => {
                            setTrackInfoByTag(prevState => ({
                                ...prevState,
                                [tag.tagName]: res.data
                            }));
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                }
            });
        }
    }, [selectTitle]);

    useEffect(()=>{
        addVisitCount();
    },[]);


    const handleSelectMusic = (music) => {
        if (music.trackImages && music.trackImages.length > 0) {
            setSelectImage(music.trackImages[0].imagePath);
            setFlag(false);
        }
    }

    const CircularIndeterminate = () => {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    };

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

        // 현재 트랙을 중지하고 새 트랙을 재생 목록에 추가하고 재생 시작
        setAudioFiles((prevAudioFiles) => [`/tracks/${filePath}`, ...prevAudioFiles]);
        setCurrentTrack(0);
        setIsPlaying(true);
    };

    if (loading) {
        return <CircularIndeterminate />;
    }


    return (
        <div className={styles.container}>
            <div className={styles.contentContainer}>
                <div className={styles.leftSide}>
                    <div className={styles.RecentTitle}>최신 업로드</div>
                    <div className={styles.RecentMusicBox}>
                        <img className={styles.RecentImg} src={`/tracks/image/${selectImage}`} alt={`/tracks/image/${selectImage}`} />
                        <div className={styles.RecentMusic}>
                            {recentMusic.map((music, index) => {
                                return (
                                    <div className={styles.RecentMusicOne} key={index} onClick={() => handleSelectMusic(music)}>
                                        <div className={styles.RecentTitleAndSinger}>
                                            <div className={styles.RecentSinger}>{music.writer}</div>
                                            <span>─</span>
                                            <div className={styles.RecentSong}>{music.title}</div>
                                        </div>
                                        <div className={styles.Listen}>
                                            <div className={styles.play} onClick={() => addTrackToPlaylist(music)}></div>
                                            <div className={styles.listenPerson}>{music.viewCount}명</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className={styles.carouselTitle}>최근 유행하는 노래</div>
                    <div className={styles.carousel}>
                        <OwlCarousel />
                    </div>
                    {Array.isArray(selectTitle) && selectTitle.filter(tag => [5, 6, 8, 9, 10, 12, 13, 14].includes(tag.tagId)).map((filterTag, index) => (
                        <div key={index}>
                            <div className={styles.carouselTitle}>{filterTag.tagName}</div>
                            <div className={styles.carousel}>
                                <OwlCarousel trackInfo={trackInfoByTag[filterTag.tagName]} trackLike={trackLike} setLike={setLike} setFavorite={setFavorite} isFavorite={isFavorite} trackInfoAll={trackInfoAll} />
                            </div>
                        </div>
                    ))}

                    <div className={styles.leftBottom}></div>
                </div>
                <div className={styles.rightSide}>
                    <RightSide trackLike={trackLike} trackInfoByTag={trackInfoByTag} />
                </div>
            </div>
        </div>
    );
}
export default Main;
