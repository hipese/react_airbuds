import React, { useContext, useEffect, useRef, useState } from 'react';
import styles from "./Likes.module.css";
import axios from "axios";
import { AutoPlayContext, CurrentTrackContext, LoginContext, MusicContext, PlayingContext, TrackContext, TrackInfoContext } from '../../../App';
import { Link } from 'react-router-dom';
import None_login_info from '../../Components/None_login_info';
import { Avatar, Box, CircularProgress, Typography } from '@mui/material';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { useInView } from 'react-intersection-observer';
import heart from '../assets/heart.svg'

const LoadingSpinner = () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress color="inherit" />
    </Box>
);

const Likes = () => {
    const [loading, setLoading] = useState(true);
    const [track, setTrack] = useState([]);
    const { audioFiles, setAudioFiles } = useContext(MusicContext);
    const { isPlaying, setIsPlaying } = useContext(PlayingContext);
    const { currentTrack, setCurrentTrack } = useContext(CurrentTrackContext);
    const { track_info, setTrack_info } = useContext(TrackInfoContext);
    const { tracks, setTracks } = useContext(TrackContext);
    const { loginID, setLoginID } = useContext(LoginContext);
    const { autoPlayAfterSrcChange, setAutoPlayAfterSrcChange } = useContext(AutoPlayContext);
    const [page, setPage] = useState(0);  // 무한 스크롤을 위한 현재 페이지 추적
    const [hasMore, setHasMore] = useState(true);  // 더 불러올 아이템이 있는지 추적
    const containerRef = useRef(null);  // 컨테이너 div를 위한 Ref
    const [myLikes, setMyLikes] = useState([]);
    const [isFavorite, setFavorite] = useState(0);

    useEffect(() => {

        if (!loginID) {
            setLoading(false);
            return;
        }

        axios.get(`/api/like/order`).then(resp => {

            const allTracks = [];

            resp.data.forEach((trackItem, outerIndex) => {
                trackItem.tracks.forEach((innerTrack, innerIndex) => {
                    const imagePath = innerTrack.trackImages.length > 0 ? innerTrack.trackImages[0].imagePath : null;

                    allTracks.push({ ...innerTrack, imagePath });
                });
            });

            // 기존 track 배열 업데이트
            console.log(allTracks);
            setTrack(allTracks);
            setLoading(false);
            if (allTracks.length < 6) {
                setHasMore(false);
            }
        }).catch(error => {
            console.error('데이터를 불러오는 중 오류 발생:', error);
            setLoading(false);
        });

        loadingLikes();
    }, [loginID]);

    const [ref, inView] = useInView({
        // triggerOnce: true, // 스크롤이 닿은 후 한 번만 실행되도록 설정
    });

    const loadingLikes = () => {
        axios.get(`/api/like/myLikes/${loginID}`).then(res => {
            console.log(res.data);
            setMyLikes(res.data);
        }).catch((e) => {
            console.log(e);
        });
    }

    useEffect(() => {
        axios.get(`/api/like/order`).then(resp => {

            const allTracks = [];

            resp.data.forEach((trackItem, outerIndex) => {
                trackItem.tracks.forEach((innerTrack, innerIndex) => {
                    const imagePath = innerTrack.trackImages.length > 0 ? innerTrack.trackImages[0].imagePath : null;

                    allTracks.push({ ...innerTrack, imagePath });
                });
            });

            // 기존 track 배열 업데이트
            console.log(allTracks);
            setTrack(allTracks);
            setLoading(false);
        }).catch(error => {
            console.error('데이터를 불러오는 중 오류 발생:', error);
            setLoading(false);
        });

        loadingLikes();
    }, [isFavorite]);

    // 바닥에 스크롤이 닿았을 때 실행될 함수
    const handleScrollToBottom = () => {
        if (hasMore) {
            // 다음 데이터를 불러오기 위한 API 호출
            axios.get(`/api/like/order`, {
                params: {
                    page: page + 1, // 페이지 번호 증가
                },
            }).then(resp => {
                const newTracks = [];

                resp.data.forEach((trackItem, outerIndex) => {
                    trackItem.tracks.forEach((innerTrack, innerIndex) => {
                        const imagePath = innerTrack.trackImages.length > 0 ? innerTrack.trackImages[0].imagePath : null;

                        newTracks.push({ ...innerTrack, imagePath });
                    });
                });

                // Update the status and increase the page by merging the existing tracks and the new tracks
                setTrack(prevTracks => [...prevTracks, ...newTracks]);

                // 받아온 데이터가 비어 있다면 setHasMore(false) 호출
                if (newTracks.length < 6) {
                    setHasMore(false);
                }

                setPage(prevPage => prevPage + 1);
            }).catch(error => {
                console.error('데이터를 불러오는 중 오류 발생:', error);
                setLoading(false);
            });
        }
    };


    useEffect(() => {
        if (inView) {
            handleScrollToBottom();
        }
    }, [inView]);

    // useEffect(() => {
    //   console.log(storedDataString)
    // }, [storedDataString]);

    //   const carouselRef = useRef(null);

    //   const goToPrev = () => {
    //     if (carouselRef.current) {
    //       carouselRef.current.prev();
    //     }
    //   };

    //   const goToNext = () => {
    //     if (carouselRef.current) {
    //       carouselRef.current.next();
    //     }
    //   };

    // 최대 12개까지의 빈 아이템을 생성
    // const emptyItems = Array.from({ length: Math.max(0, 12 - tracks.length) }, (_, index) => (
    //   <div key={`empty-${index}`} className={styles.item}>
    //     <img src="http://placehold.it/150x150" alt={`Empty Image ${index + 1}`} />
    //     <div className={styles.carouselTitle}>빈 곡</div>
    //     <div className={styles.carouselSinger}>Unknown Artist</div>
    //   </div>
    // ));

    const addStreamCount = (trackId, singerId, e) => {
        const formdata = new FormData();
        const date = new Date().toISOString();
        formdata.append("trackId", trackId);
        formdata.append("streamDate", date);
        formdata.append("streamSinger", singerId);
        axios.put(`/api/dashboard/addStream`, formdata).then(res => {

        }).catch((e) => {
            console.log(e);
        });
    }

    // 특정 트랙을 재생 목록에 추가하는 함수
    const addTrackToPlaylist = (track) => {

        axios.post(`/api/cplist`, {
            trackId: track.trackId,
            id: loginID
        }).then(resp => {
            addStreamCount(track.trackId, track.writeId);
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

        // 현재 트랙을 중지하고 새 트랙을 재생 목록에 추가하고 재생 시작
        setAudioFiles((prevAudioFiles) => [`/tracks/${filePath}`, ...prevAudioFiles]);
        setCurrentTrack(0);
        setIsPlaying(true);
    };
    const countForTrack = (trackId) => {
        const countInfo = myLikes.find(item => item.trackId === trackId);
        return countInfo ? countInfo.count : 0;
    }

    const handleFavorite = (trackId, isLiked, e) => {
        if (loginID !== "") {
            if (!isLiked) {
                const formData = new FormData();
                formData.append("likeSeq", 0);
                formData.append("userId", loginID);
                formData.append("trackId", trackId);
                axios.post(`/api/like`, formData).then(res => {
                    setMyLikes([...myLikes, { trackId: trackId, userId: loginID, likeSeq: res.data }]);
                    setFavorite(isFavorite + 1);
                    e.target.classList.add(styles.onClickHeart);
                    e.target.classList.remove(styles.NonClickHeart);
                }).catch((e) => {
                    console.log(e);
                });
            } else {
                const deleteData = new FormData();
                deleteData.append("trackId", trackId);
                deleteData.append("userId", loginID);
                axios.post(`/api/like/delete`, deleteData).then(res => {
                    const newLikeList = myLikes.filter(e => e.trackId !== trackId);
                    setMyLikes(newLikeList);
                    setFavorite(isFavorite + 1);
                    e.target.classList.remove(styles.onClickHeart);
                    e.target.classList.add(styles.NonClickHeart);
                }).catch((e) => {
                    console.log(e);
                });
            }
        } else {
            alert("좋아요는 로그인을 해야 합니다.")
            return;
        }
    }

    return (
        <>
            {loading ? (
                <div className={styles.loadingContainer}>
                    <LoadingSpinner />
                </div>
            ) : (
                loginID ? (
                    <>
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
                                    <div className={styles.track_button}>
                                        <div className={styles.play_button}
                                            onClick={() => addTrackToPlaylist(track)} // div를 클릭할 때마다 호출됨
                                        >
                                            <PlayCircleIcon sx={{ width: '60px', height: '60px' }} />
                                        </div>
                                        <div className={styles.track_duration}>
                                            {formatDurationFromHHMMSS(track.duration)}
                                        </div>
                                        <div className={styles.like_share}>
                                            <div className={styles.like}>
                                                <img
                                                    src={heart}
                                                    alt=""
                                                    className={
                                                        myLikes.some(trackLike => trackLike.trackId === track.trackId)
                                                            ? styles.onClickHeart : styles.NonClickHeart}
                                                    onClick={(e) => { handleFavorite(track.trackId, myLikes.some(trackLike => trackLike.trackId === track.trackId), e) }} />
                                                {countForTrack(track.trackId)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {hasMore ? (
                                <div ref={ref} />
                            ) : (
                                <div className={styles.endMessage}>
                                    <Typography variant="h6" gutterBottom>
                                        재생 목록의 끝입니다. 새로운 음악을 찾아보세요!
                                    </Typography>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className={styles.noneLogin}>
                        <None_login_info />
                    </div>
                )
            )}
        </>
    );
}

const formatDurationFromHHMMSS = (duration) => {
    const [hours, minutes, seconds] = duration.split(':');
    return `${hours}:${minutes}:${seconds}`;
};

export default Likes;