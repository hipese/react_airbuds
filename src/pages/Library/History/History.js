import React, { useContext, useEffect, useRef, useState } from 'react';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import styles from "./History.module.css";
import axios from "axios";
import { AutoPlayContext, CurrentTrackContext, LoginContext, MusicContext, PlayingContext, TrackContext, TrackInfoContext } from '../../../App';
import { Link } from 'react-router-dom';
import None_login_info from '../../Components/None_login_info';
import { Avatar, Box, CircularProgress, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RepeatIcon from '@mui/icons-material/Repeat';
import { useInView } from 'react-intersection-observer';

const LoadingSpinner = () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress color="inherit" />
    </Box>
);

const History = () => {
    const [loading, setLoading] = useState(true);
    const [track, setTrack] = useState([]);
    const { audioFiles, setAudioFiles } = useContext(MusicContext);
    const { isPlaying, setIsPlaying } = useContext(PlayingContext);
    const { currentTrack, setCurrentTrack } = useContext(CurrentTrackContext);
    const { track_info, setTrack_info } = useContext(TrackInfoContext);
    const { tracks, setTracks } = useContext(TrackContext);
    const { loginID, setLoginID } = useContext(LoginContext);
    const { autoPlayAfterSrcChange, setAutoPlayAfterSrcChange } = useContext(AutoPlayContext);
    const storedDataString = localStorage.getItem('loginID');
    const [page, setPage] = useState(0);  // 무한 스크롤을 위한 현재 페이지 추적
    const [hasMore, setHasMore] = useState(true);  // 더 불러올 아이템이 있는지 추적
    const containerRef = useRef(null);  // 컨테이너 div를 위한 Ref

    useEffect(() => {
        axios.get(`/api/cplist/${storedDataString}`).then(resp => {

            const allTracks = [];

            resp.data.forEach((trackItem, outerIndex) => {
                trackItem.tracks.forEach((innerTrack, innerIndex) => {
                    const imagePath = innerTrack.trackImages.length > 0 ? innerTrack.trackImages[0].imagePath : null;

                    allTracks.push({ ...innerTrack, imagePath });
                });
            });

            // 기존 track 배열 업데이트
            setTrack(allTracks);
            setLoading(false);
        });
    }, [loginID]);

    const [ref, inView] = useInView({
        // triggerOnce: true, // 스크롤이 닿은 후 한 번만 실행되도록 설정
    });

    // 바닥에 스크롤이 닿았을 때 실행될 함수
    const handleScrollToBottom = () => {
        if (hasMore) {
            // 다음 데이터를 불러오기 위한 API 호출
            axios.get(`/api/cplist/${storedDataString}`, {
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
                if (newTracks.length === 0) {
                    setHasMore(false);
                }

                setPage(prevPage => prevPage + 1);
                setLoading(false);
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

    // 특정 트랙을 재생 목록에 추가하는 함수
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


export default History;
