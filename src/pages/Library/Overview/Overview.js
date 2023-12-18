import React, { useContext, useEffect, useRef, useState } from 'react';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import styles from "./Overview.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import { AutoPlayContext, CurrentTrackContext, LoginContext, MusicContext, PlayingContext, TrackContext, TrackInfoContext } from '../../../App';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { Link } from 'react-router-dom';
import None_login_info from '../../Components/None_login_info';
import { Box, CircularProgress } from '@mui/material';

const LoadingSpinner = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
    <CircularProgress color="inherit" />
  </Box>
);

const Overview = () => {
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

  useEffect(() => {
    axios.get(`/api/cplist/all/${storedDataString}`).then(resp => {
  
      const allTracks = [];
  
      resp.data.forEach((trackItem, outerIndex) => {
        trackItem.tracks.forEach((innerTrack, innerIndex) => {
          const imagePath = innerTrack.trackImages.length > 0 ? innerTrack.trackImages[0].imagePath : null;
  
          allTracks.push({ ...innerTrack, imagePath });
        });
      });
  
      // 최대 12개의 트랙으로 제한
      const limitedTracks = allTracks.slice(0, 12);
  
      // 기존 track 배열 업데이트
      setTrack(limitedTracks);
      setLoading(false);
    });
  }, [loginID]);

  // useEffect(() => {
  //   console.log(storedDataString)
  // }, [storedDataString]);

  const carouselRef = useRef(null);

  const goToPrev = () => {
    if (carouselRef.current) {
      carouselRef.current.prev();
    }
  };

  const goToNext = () => {
    if (carouselRef.current) {
      carouselRef.current.next();
    }
  };

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
            <div className={styles.carouselTitle1}>최근에 재생한 노래들</div>
            <div className={styles.carousel}>
              <div className={styles.Carousel}>
                <OwlCarousel
                  className={styles.OwlCarousel}
                  loop
                  margin={10}
                  nav={false}
                  dots={false}
                  autoplay
                  autoplayTimeout={10000}
                  autoWidth={true}
                  autoplayHoverPause
                  responsive={{
                    768: {
                      items: 5
                    },
                  }}
                  ref={carouselRef}
                >
                  {track.map((track, index) => (
                    <div
                      className={styles.item}
                      key={index}
                    >
                      <div>
                        <Link to={`/Detail/${track.trackId}`}>
                          <img src={`/tracks/image/${track.imagePath}`} alt={`Image ${index + 1}`} />
                          <div className={styles.carouselTitle}>{track.title}</div>
                          <div className={styles.carouselSinger}>
                            {track.writer}
                          </div>
                        </Link>
                      </div>

                      <div
                        className={styles.play_button}
                        onClick={() => addTrackToPlaylist(track)} // div를 클릭할 때마다 호출됨
                      >
                        <PlayCircleIcon sx={{ width: '40px', height: '40px' }} />
                      </div>
                      <div className={styles.audioPath}>{track.filePath}</div>
                    </div>
                  ))}
                  {/* 빈 아이템 추가
                  {emptyItems} */}
                </OwlCarousel>
                <div className={styles.carouselButton}>
                  <button className={styles.owlPrev} onClick={goToPrev}>
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </button>
                  <button className={styles.owlNext} onClick={goToNext}>
                    <FontAwesomeIcon icon={faChevronRight} />
                  </button>
                </div>
              </div>
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


export default Overview;
