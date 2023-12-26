
import React, { useEffect, useState, useRef, useContext } from "react";
import style from "./ShowMusicList.module.css"
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import { Col, Row } from "reactstrap";
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import { Box, CircularProgress } from '@mui/material';
import OwlCarousel from 'react-owl-carousel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { LoginContext } from "../../App";


const LoadingSpinner = () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress color="inherit" />
    </Box>
);

const ShowMusicList = () => {
    const { searchText } = useParams();

    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState();
    const [searchTracks, setSearchTracks] = useState([]);
    const [searchAlbums, setSearchAlbums] = useState([]);

    const { loginID, setLoginID } = useContext(LoginContext);

    const navigate = useNavigate();


    useEffect(() => {

        console.log(searchText)

        axios.get(`/api/track/searchText/${searchText}`).then(resp => {
            console.log(resp.data);
            setSearchTracks(resp.data);
            setSearch(searchText);
            setLoading(false);
        })

        axios.get(`/api/album/searchText/${searchText}`).then(resp => {
            console.log(resp.data);
            setSearchAlbums(resp.data);
            setSearch(searchText);
            setLoading(false);
        })
    }, [searchText])

    const handleAlbumDtail = (albumId, albumData) => {
        navigate(`/Album/Detail/${albumId}`, { state: { albumData } });
      };
      

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

    
    const emptyItems = Array.from({ length: Math.max(0, searchTracks.length) }, (_, index) => (
        <div key={`empty-${index}`} className={style.item}>
            <img src="http://placehold.it/150x150" alt={`Empty Image ${index + 1}`} />
            <div className={style.carouselTitle}>빈 곡</div>
            <div className={style.carouselSinger}>Unknown Artist</div>
        </div>
    ));

    const emptyItems2 = Array.from({ length: Math.max(0, searchAlbums.length) }, (_, index) => (
        <div key={`empty-${index}`} className={style.item}>
            <img src="http://placehold.it/150x150" alt={`Empty Image ${index + 1}`} />
            <div className={style.carouselTitle}>빈 곡</div>
            <div className={style.carouselSinger}>Unknown Artist</div>
        </div>
    ));

    const combinedItems = [
        ...searchAlbums.map((album, index) => (
            <div className={style.item} key={index}>
                <div onClick={() => handleAlbumDtail(album.albumId, album)}>
                        <img src={`/tracks/image/${album.coverImagePath}`} alt={`Image ${index + 1}`} />
                        <div className={style.carouselTitle}>{album.title}</div>
                        <div className={style.carouselSinger}>
                            {album.tracks && album.tracks.length > 0 && album.tracks.map((track, trackIndex) => (
                                <span key={trackIndex}>{track.writer},</span>
                            ))}
                        </div>
                </div>

                
                <div className={style.audioPath}>{album.filePath}</div>
            </div>
        )),
        ...emptyItems
    ];

    const combinedItems2 = [
        ...searchTracks.map((track, index) => (
            <div className={style.item} key={index}>
                <div>
                    <Link to={`/Detail/${track.trackId}`}>
                        {track.trackImages && track.trackImages.length > 0 ? (
                            <>
                                <img src={`/tracks/image/${track.trackImages[0].imagePath}`} alt={`Image ${index + 1}`} />
                                <div className={style.carouselTitle}>{track.title}</div>
                                <div className={style.carouselSinger}>{track.writer}</div>
                            </>
                        ) : (
                            // 대체 내용 또는 처리 로직 추가
                            <>
                                <img src="http://placehold.it/150x150" alt={`Empty Image ${index + 1}`} />
                                <div className={style.carouselTitle}>{track.title}</div>
                                <div className={style.carouselSinger}>{track.writer}</div>
                            </>
                        )}
                    </Link>
                </div>
                <div className={style.audioPath}>{track.filePath}</div>
            </div>
        )),
        ...emptyItems2
    ];


    return (
        <Row className={style.mainContaier}>
            {loading ? (
                <div className={style.loadingContainer}>
                    <LoadingSpinner />
                </div>
            ) : (
                <React.Fragment>
                    {searchAlbums.length > 0 && (
                        <>
                            <div className={style.carouselTitle1}>"{searchText}"로 앨범 검색결과</div>
                            <div className={style.carousel}>
                                <div className={style.Carousel}>
                                    <OwlCarousel
                                        className={style.OwlCarousel}
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
                                    <div className={style.carouselButton}>
                                        <button className={style.owlPrev} onClick={goToPrev1}>
                                            <FontAwesomeIcon icon={faChevronLeft} />
                                        </button>
                                        <button className={style.owlNext} onClick={goToNext1}>
                                            <FontAwesomeIcon icon={faChevronRight} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                    {searchTracks.length > 0 && (
                        <>
                            <div className={style.carouselTitle1}>"{searchText}"로 트랙 검색결과</div>
                            <div className={style.carousel}>
                                <div className={style.Carousel}>
                                    <OwlCarousel
                                        className={style.OwlCarousel}
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
                                    <div className={style.carouselButton}>
                                        <button className={style.owlPrev} onClick={goToPrev2}>
                                            <FontAwesomeIcon icon={faChevronLeft} />
                                        </button>
                                        <button className={style.owlNext} onClick={goToNext2}>
                                            <FontAwesomeIcon icon={faChevronRight} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                    {searchAlbums.length === 0 && searchTracks.length === 0 && (
                        <div className={style.noSongsMessage}>
                            검색결과가 존재하지 않습니다.
                        </div>
                    )}
                </React.Fragment>
            )}
        </Row>
    )
}

export default ShowMusicList;