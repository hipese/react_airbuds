
import React, { useEffect, useState, useRef, useContext } from "react";
import style from "./ShowMusicList.module.css"
import { useParams } from 'react-router-dom';
import axios from "axios";
import { Col, Row } from "reactstrap";
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import { Box, CircularProgress } from '@mui/material';
import TrackSearchResult from "./SearchResult/TrackSearchResult";
import AlbumSearchResult from "./SearchResult/AlbumSearchResult";
import IconMenu from "./IconMenu";


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
    const [viewState, setViewState] = useState(0);


    useEffect(() => {

        axios.get(`/api/track/searchText/${searchText}`).then(resp => {
            const tracksWithImages = resp.data.map((track) => {
                const imagePath = track.trackImages.length > 0 ? track.trackImages[0].imagePath : null;
                return { ...track, imagePath };
            });
            setSearchTracks(tracksWithImages);
            setSearch(searchText);
            setLoading(false);
        })

        axios.get(`/api/album/searchText/${searchText}`).then(resp => {
            setSearchAlbums(resp.data);
            setSearch(searchText);
            setLoading(false);
            console.log(resp.data);
        })

    }, [searchText])
    

    return (
        <Row className={style.mainContaier}>
            <Col sm='12' className={style.titleBox}>
                "{searchText}" 검색결과
            </Col>
            <Col sm={{ size: 8, offset: 2 }}>
                <hr />
            </Col>
            <Row className={style.searchResultBox}>
                <Col sm='2'>

                </Col>
                <Col sm='2'>
                    <IconMenu viewState={viewState} setViewState={setViewState} />
                </Col>
                <Col sm='6'>
                    <Row>
                        {(viewState === 1 && searchTracks && searchTracks.length > 0) && (

                            <Col sm='12'>
                                <Col sm='12' className={style.titleText}>
                                    트랙목록
                                </Col>
                                <TrackSearchResult searchTracks={searchTracks} />
                            </Col>
                        )}
                        {(viewState === 1 && searchTracks && searchTracks.length == 0) && (
                            <Col sm='12' className={style.noSearchText}>
                                검색결과가 존재하지 않습니다.
                            </Col>
                        )}
                        {(viewState === 2 && searchAlbums && searchAlbums.length > 0) && (
                            <Col sm='12'>
                                <Col sm='12' className={style.titleText}>
                                    앨범목록
                                </Col>
                                <AlbumSearchResult searchAlbums={searchAlbums} />
                            </Col>
                        )}
                        {(viewState === 2 && searchAlbums && searchAlbums.length == 0) && (
                            <Col sm='12' className={style.noSearchText}>
                                검색결과가 존재하지 않습니다.
                            </Col>
                        )}
                        {(viewState === 0 && searchTracks && searchAlbums && (searchTracks.length > 0 || searchAlbums.length > 0)) && (
                            <>
                                <Col sm='12'>

                                    {searchAlbums.length > 0 && (
                                        <Col sm='12' className={style.titleText}>
                                            앨범목록
                                        </Col>
                                    )}

                                    <AlbumSearchResult searchAlbums={searchAlbums} />
                                </Col>

                                <Col sm='12'>
                                    {searchTracks.length > 0 && (
                                        <Col sm='12' className={style.titleText}>
                                            트랙목록
                                        </Col>
                                    )}
                                    <TrackSearchResult searchTracks={searchTracks} />
                                </Col>
                            </>
                        )}
                        {(viewState === 0 && searchTracks.length === 0 && searchAlbums.length === 0) && (
                            <Col sm='12' className={style.noSearchText}>
                                검색결과가 존재하지 않습니다.
                            </Col>
                        )}
                    </Row>
                </Col>

                <Col sm='2'>

                </Col>
            </Row>
        </Row>
    )
}

export default ShowMusicList;