import React, {useEffect,useState, useRef} from 'react';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import styles from "./Carousel.module.css"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import heart from "./assets/heart.svg";
import playlist from "./assets/playlist.svg";

const Carousel = React.memo(({ trackInfo }) => {
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
    <div className={styles.Carousel}>
        <OwlCarousel
            className={styles.OwlCarousel}
            loop 
            margin={20}
            nav={false}
            dots={false}
            // autoplay
            // autoplayTimeout={10000}  
            autoWidth={true}
            // autoplayHoverPause 
            responsive={{
                768: {
                    items: 4
                },
              }}
            ref={carouselRef}
        >
              {trackInfo && trackInfo.map((track, index) => {
                  const trackImage = track.track.trackImages && track.track.trackImages.length > 0
                    ? `/tracks/image/${track.track.trackImages[0].imagePath}`
                    : "http://placehold.it/150x150";
                    return (
                        <div className={styles.item} key={index}>
                            <div className={styles.imgHover}>
                                <img className={styles.trackImg} src={trackImage} alt={`Track ${index + 1} - ${track.track.title}`} />
                                <div className={styles.hoverNaviheart} >
                                    <img src={heart} alt="" className={styles.onClickHeart} />
                                </div>
                                <div className={styles.hoverNaviplaylist}><img src={playlist} alt="" className={styles.NonClickPlaylist} /></div>
                            </div>
                            <div className={styles.carouselContents}> 
                                <div className={styles.carouselTitle}>{track.track.title}</div>
                                <div className={styles.carouselSinger}>{track.track.writer}</div>
                            </div>
                        </div>
                    );
                })}
             
        </OwlCarousel>
        <div className={styles.carouselButton}>
            <button className={styles.owlPrev} onClick={goToPrev}><FontAwesomeIcon icon={faChevronLeft} /></button> 
            <button className={styles.owlNext} onClick={goToNext}><FontAwesomeIcon icon={faChevronRight} /></button> 
        </div>        
    </div>
  );
});

export default Carousel;
