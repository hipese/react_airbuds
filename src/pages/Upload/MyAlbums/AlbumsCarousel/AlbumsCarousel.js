import React, { useEffect, useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import styles from "./AlbumsCarousel.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { LoginContext } from '../../../../App';
import { Button } from 'reactstrap';

const Carousel = React.memo(({ myAlbumsInfo}) => {
    const carouselRef = useRef(null);


    const navigate = useNavigate(); // Use the useNavigate hook

    const { loginID, setLoginID } = useContext(LoginContext);
    const storageId = localStorage.getItem("loginID");

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

    const getAlbumWriters = (album) => {
        return album.albumWriter.map(writer => writer.artistNickname).join(', ');
    }

    const handleAlbumClick = (albumId) => {
        const albumData = myAlbumsInfo.find(album => album.albumId === albumId);
        navigate(`/Album/Detail/${albumId}`, { state: { albumData } });
    }

    const uniqueAlbums = myAlbumsInfo.filter((v, i, a) => a.findIndex(t => (t.albumId === v.albumId)) === i);

    console.log(myAlbumsInfo);

    return (
        <div className={styles.Carousel}>
            <OwlCarousel
                className={styles.OwlCarousel}
                loop
                margin={20}
                nav={false}
                dots={false}
                mouseDrag={false}
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
                {uniqueAlbums && uniqueAlbums.map((album, index) => {
                    const albumImage = album.coverImagePath
                        ? `/tracks/image/${album.coverImagePath}`
                        : "http://placehold.it/150x150";
                    const albumWriters = getAlbumWriters(album);
                    const hoverClass = loginID ? styles.imgHover : styles.nonImageHover;

                    return (
                        <div className={styles.item} key={index} onClick={() => handleAlbumClick(album.albumId)}>
                            <div className={hoverClass}>
                                <img src={albumImage} alt={album.title} className={styles.albumImage} />
                            </div>
                            <div className={styles.carouselContents}>

                                <div className={styles.carouselTitle}>{album.title}</div>
                                <div className={styles.carouselSinger}>{albumWriters}</div>
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
