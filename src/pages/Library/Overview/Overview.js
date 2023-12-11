import React, { useEffect, useRef, useState } from 'react';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import styles from "./Overview.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import axios from "axios"

const Overview = () => {

  // 데이터베이스에 음원목록을 가져오는 변수
  const [tracks, setTracks] = useState([]);

  const testText = "잉여";

  // 선택한 writer에 음원 정보를 전부 가져오기
  useEffect(() => {
    axios.get(`/api/track/bywriter/${testText}`).then(resp => {
      const tracksWithImages = resp.data.map(track => {
        // trackImages 배열이 비어있지 않은 경우, 첫 번째 이미지의 경로를 추출
        const imagePath = track.trackImages.length > 0 ? track.trackImages[0].imagePath : null;
        return { ...track, imagePath };
      });

      console.log("Tracks with images:", tracksWithImages);
      setTracks(tracksWithImages);
    });
  }, []);



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
  }
  return (
    <><div className={styles.carouselTitle1}>최근에 재생한 노래들</div>
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
            <div className={styles.item}><img src="http://placehold.it/150x150" alt="Image 1" />
              <div className={styles.carouselTitle}>여기다 넣으면 잘 됨</div>
              <div className={styles.carouselSinger}>IU</div>
            </div>
            {tracks.map((track, index) => (
              <div className={styles.item} key={index}>
                <img src={"/tracks/image/"+track.imagePath} alt={`Image ${index + 1}`} />
                <div className={styles.carouselTitle}>{track.title}</div>
                <div className={styles.carouselSinger}>{track.writer}</div>
              </div>
            ))}
          </OwlCarousel>
          <div className={styles.carouselButton}>
            <button className={styles.owlPrev} onClick={goToPrev}><FontAwesomeIcon icon={faChevronLeft} /></button>
            <button className={styles.owlNext} onClick={goToNext}><FontAwesomeIcon icon={faChevronRight} /></button>
          </div>
        </div>
      </div></>
  );
};

export default Overview;
