import React, {useEffect,useState, useRef} from 'react';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import styles from "./Carousel.module.css"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const Carousel = React.memo(({ trackInfo }) => {
    console.log("Carousel.js: trackInfo:", trackInfo);
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
            margin={10}
            nav={false}
            dots={false}
            // autoplay
            // autoplayTimeout={10000}  
            autoWidth={true}
            // autoplayHoverPause 
            responsive={{
                768: {
                    items: 5
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
                            <img src={trackImage} alt={`Track ${index + 1} - ${track.track.title}`} width={"180px"} height={"180px"} />
                            <div className={styles.carouselTitle}>{track.track.title}</div>
                            <div className={styles.carouselSinger}>{track.track.writer}</div>
                        </div>
                    );
                })}
             


        {/* <div className={styles.item}><img src="http://placehold.it/150x150" alt="Image 1" />
            <div className={styles.carouselTitle}>여기다 넣으면 잘 됨</div>
            <div className={styles.carouselSinger}>IU</div>
        </div> 
        <div className={styles.item}><img src="http://placehold.it/150x150" alt="Image 2" />제목2번</div>
        <div className={styles.item}><img src="http://placehold.it/150x150" alt="Image 3" />제목3번</div>
        <div className={styles.item}><img src="http://placehold.it/150x150" alt="Image 4" />제목4번</div>
        <div className={styles.item}><img src="http://placehold.it/150x150" alt="Image 5" />제목5번</div>
        <div className={styles.item}><img src="http://placehold.it/150x150" alt="Image 6" />제목6번</div>
        <div className={styles.item}><img src="http://placehold.it/150x150" alt="Image 7" />제목7번</div>
        <div className={styles.item}><img src="http://placehold.it/150x150" alt="Image 8" />제목8번</div>
        <div className={styles.item}><img src="http://placehold.it/150x150" alt="Image 9" />제목9번</div>
        <div className={styles.item}><img src="http://placehold.it/150x150" alt="Image 10" />제목10번</div>
        <div className={styles.item}><img src="http://placehold.it/150x150" alt="Image 11" />제목11번</div>
        <div className={styles.item}><img src="http://placehold.it/150x150" alt="Image 12" />제목12번</div> */}
        </OwlCarousel>
        <div className={styles.carouselButton}>
            <button className={styles.owlPrev} onClick={goToPrev}><FontAwesomeIcon icon={faChevronLeft} /></button> 
            <button className={styles.owlNext} onClick={goToNext}><FontAwesomeIcon icon={faChevronRight} /></button> 
        </div>        
    </div>
  );
});

export default Carousel;
