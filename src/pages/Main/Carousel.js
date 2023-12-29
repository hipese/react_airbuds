import React, { useEffect, useState, useRef, useContext } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from "./Carousel.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import heart from "./assets/heart.svg";
import playlist from "./assets/playlist.svg";
import CarouselModal from "./CarouselModal/CarouselModal";
import { LoginContext } from '../../App';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Carousel = React.memo(({ trackInfo, trackLike, setLike, setFavorite, isFavorite, trackInfoAll }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTrack, setSelectedTrack] = useState(null);
    const { loginID, setLoginID } = useContext(LoginContext);
    const sliderRef = useRef(null);

    const openModal = (track) => {
        setIsModalOpen(true);
        setSelectedTrack(track);
    }
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedTrack(null);
    }

    const handlePrev = () => {
        if (sliderRef.current) {
            sliderRef.current.slickPrev();
        }
    };

    const handleNext = () => {
        if (sliderRef.current) {
            sliderRef.current.slickNext();
        }
    };

    const handleFavorite = (trackId, isLiked, e) => {
        if (loginID !== "") {
            if (!isLiked) {
                const formData = new FormData();
                formData.append("likeSeq", 0);
                formData.append("userId", loginID);
                formData.append("trackId", trackId);
                axios.post(`/api/like`, formData).then(res => {
                    setLike([...trackLike, { trackId: trackId, userId: loginID, likeSeq: res.data }]);
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
                    const newLikeList = trackLike.filter(e => e.trackId !== trackId);
                    setLike(newLikeList);
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
    };

    const slidesToShow = 4.3;
    const slideWidth = 100 / slidesToShow;
    const settings = {
        dots: false, 
        infinite: true, 
        speed: 500,
        slidesToShow: slidesToShow,
        slidesToScroll: 1,
        arrows: false,
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: true,
        pauseOnFocus: true,
        swipeToSlide: false,
        draggable: false,
    };

    return (
        <div className={styles.Carousel}>
            <Slider {...settings} ref={sliderRef}>
                {trackInfo && trackInfo.map((track, index) => {
                    const trackImage = track.track.trackImages && track.track.trackImages.length > 0
                        ? `${track.track.trackImages[0].imagePath}`
                        : "http://placehold.it/150x150";
                    //setLikeState(trackLike.some(trackLike => trackLike.trackId === track.track.trackId));
                    //settingLike(track.track.trackId);

                    const hoverClass = loginID ? styles.imgHover : styles.nonImageHover;
                    return (
                        <Link to={`/Detail/${track.track.trackId}`} style={{ color: 'inherit' }}>
                            <div className={styles.item} key={index} style={{ width: `${slideWidth}%` }}>
                                <div className={hoverClass}>
                                    <img className={styles.trackImg} src={trackImage} alt={`Track ${index + 1} - ${track.track.title}`} />
                                    {loginID && (
                                        <>
                                            <div className={styles.hoverNaviheart}>
                                                <img
                                                    src={heart}
                                                    alt=""
                                                    className={
                                                        trackLike.some(trackLike => trackLike.trackId === track.track.trackId)
                                                            ? styles.onClickHeart : styles.NonClickHeart}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleFavorite(track.track.trackId, trackLike.some(trackLike => trackLike.trackId === track.track.trackId), e);
                                                    }}
                                                />
                                            </div>
                                            <div className={styles.hoverNaviplaylist}>
                                                <img
                                                    src={playlist}
                                                    alt=""
                                                    className={styles.NonClickPlaylist}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        openModal(track);
                                                    }}
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className={styles.carouselContents}>
                                    <div className={styles.carouselTitle}>{track.track.title}</div>
                                    <div className={styles.carouselSinger}>{track.track.writer}</div>
                                </div>

                            </div>
                        </Link>
                    );
                })}

            </Slider>
            <div className={styles.carouselButton}>
                <button className={styles.owlPrev} onClick={handlePrev}><FontAwesomeIcon icon={faChevronLeft} /></button>
                <button className={styles.owlNext} onClick={handleNext}><FontAwesomeIcon icon={faChevronRight} /></button>
            </div>
            {isModalOpen && <CarouselModal trackInfo={selectedTrack} onClose={closeModal} trackLike={trackLike} trackInfoAll={trackInfoAll} />}
        </div>
    );
});

export default Carousel;
