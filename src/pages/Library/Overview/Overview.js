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
import None_track_info from '../../Components/None_login_info';
import None_overview_info from '../../Components/None_overview_info';

const LoadingSpinner = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
    <CircularProgress color="inherit" />
  </Box>
);

const Overview = () => {
  const [loading, setLoading] = useState(true);
  const [track, setTrack] = useState([]);
  const [track2, setTrack2] = useState([]);
  const { audioFiles, setAudioFiles } = useContext(MusicContext);
  const { isPlaying, setIsPlaying } = useContext(PlayingContext);
  const { currentTrack, setCurrentTrack } = useContext(CurrentTrackContext);
  const { track_info, setTrack_info } = useContext(TrackInfoContext);
  const { tracks, setTracks } = useContext(TrackContext);
  const { loginID, setLoginID } = useContext(LoginContext);
  const { autoPlayAfterSrcChange, setAutoPlayAfterSrcChange } = useContext(AutoPlayContext);

  useEffect(() => {

    if (!loginID) {
      setLoading(false);
      return;
    }

    axios.get(`/api/cplist/all`).then(resp => {

      const allTracks = [];

      resp.data.forEach((trackItem, outerIndex) => {
        trackItem.tracks.forEach((innerTrack, innerIndex) => {
          const imagePath = innerTrack.trackImages.length > 0 ? innerTrack.trackImages[0].imagePath : null;

          allTracks.push({ ...innerTrack, imagePath });
        });
      })

      // 최대 12개의 트랙으로 제한
      const limitedTracks = allTracks.slice(0, 12);

      // 기존 track 배열 업데이트
      setTrack(limitedTracks);
    }).catch(error => {
      console.error('데이터를 불러오는 중 오류 발생:', error);
      setLoading(false);
    });

    axios.get(`/api/like/all`).then(resp2 => {

      const allTracks2 = [];

      resp2.data.forEach((trackItem2, outerIndex) => {
        trackItem2.tracks.forEach((innerTrack2, innerIndex) => {
          const imagePath = innerTrack2.trackImages.length > 0 ? innerTrack2.trackImages[0].imagePath : null;

          allTracks2.push({ ...innerTrack2, imagePath });
        });
      });

      // 최대 12개의 트랙으로 제한
      const limitedTracks2 = allTracks2.slice(0, 12);

      // 기존 track 배열 업데이트
      setTrack2(limitedTracks2);
      setLoading(false);
    }).catch(error => {
      console.error('데이터를 불러오는 중 오류 발생:', error);
      setLoading(false);
    });
  }, [loginID]);

  // useEffect(() => {
  //   console.log(storedDataString)
  // }, [storedDataString]);

  const carouselRef1 = useRef(null);
  const carouselRef2 = useRef(null);

  const goToPrev1 = () => {
    if (carouselRef1.current) {
      carouselRef1.current.prev();
    }
  };

  const goToNext1 = () => {
    if (carouselRef1.current) {
      carouselRef1.current.next();
    }
  };

  const goToPrev2 = () => {
    if (carouselRef2.current) {
      carouselRef2.current.prev();
    }
  };

  const goToNext2 = () => {
    if (carouselRef2.current) {
      carouselRef2.current.next();
    }
  };

  // 최대 12개까지의 빈 아이템을 생성
  const emptyItems = Array.from({ length: Math.max(0, 11 - track.length) }, (_, index) => (
    <div key={`empty-${index}`} className={styles.item}>
      <img src="http://placehold.it/150x150" alt={`Empty Image ${index + 1}`} />
      <div className={styles.carouselTitle}>빈 곡</div>
      <div className={styles.carouselSinger}>Unknown Artist</div>
    </div>
  ));

  const emptyItems2 = Array.from({ length: Math.max(0, 11 - track2.length) }, (_, index) => (
    <div key={`empty-${index}`} className={styles.item}>
      <img src="http://placehold.it/150x150" alt={`Empty Image ${index + 1}`} />
      <div className={styles.carouselTitle}>빈 곡</div>
      <div className={styles.carouselSinger}>Unknown Artist</div>
    </div>
  ));

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

  // 특정 트랙을 재생 목록에 추가하는 함수
  const addTrackToPlaylist = (track) => {
    console.log(track);
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

    // 현재 트랙을 중지하고 새 트랙을 재생 목록에 추가하고 재생 시작
    setAudioFiles((prevAudioFiles) => [`/tracks/${filePath}`, ...prevAudioFiles]);
    setCurrentTrack(0);
    setIsPlaying(true);
  };

  const combinedItems = [
    ...track.map((track, index) => (
      <div className={styles.item} key={index}>
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
    )),
    ...emptyItems
  ];

  const combinedItems2 = [
    ...track2.map((track, index) => (
      <div className={styles.item} key={index}>
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
    )),
    ...emptyItems2
  ];

  return (
    <>
      {loading ? (
        <div className={styles.loadingContainer}>
          <LoadingSpinner />
        </div>
      ) : (
        loginID ? (
          <>
            {track.length > 0 && (
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
                      ref={carouselRef1}
                    >
                      {combinedItems}
                    </OwlCarousel>
                    <div className={styles.carouselButton}>
                      <button className={styles.owlPrev} onClick={goToPrev1}>
                        <FontAwesomeIcon icon={faChevronLeft} />
                      </button>
                      <button className={styles.owlNext} onClick={goToNext1}>
                        <FontAwesomeIcon icon={faChevronRight} />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
            {track2.length > 0 && (
              <>
                <div className={styles.carouselTitle1}>좋아요한 노래들</div>
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
                      ref={carouselRef2}
                    >
                      {combinedItems2}
                    </OwlCarousel>
                    <div className={styles.carouselButton}>
                      <button className={styles.owlPrev} onClick={goToPrev2}>
                        <FontAwesomeIcon icon={faChevronLeft} />
                      </button>
                      <button className={styles.owlNext} onClick={goToNext2}>
                        <FontAwesomeIcon icon={faChevronRight} />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
            {track.length === 0 && track2.length === 0 && (
              <div className={styles.noSongsMessage}>
                <None_overview_info />
              </div>
            )}
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
