
import React, { useEffect, useState, useRef, useContext } from "react";
import style from "./ShowMusicList.module.css"
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import { Col, Row } from "reactstrap";
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import { Box, CircularProgress } from '@mui/material';

import { LoginContext } from "../../App";
import TrackSearchResult from "./SearchResult/TrackSearchResult";
import AlbumSearchResult from "./SearchResult/AlbumSearchResult";


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

        axios.get(`/api/track/searchText/${searchText}`).then(resp => {
            setSearchTracks(resp.data);
            setSearch(searchText);
            setLoading(false);
        })

        axios.get(`/api/album/searchText/${searchText}`).then(resp => {
            setSearchAlbums(resp.data);
            setSearch(searchText);
            setLoading(false);
        })

    }, [searchText])

    const handleAlbumDtail = (albumId, albumData) => {
        navigate(`/Album/Detail/${albumId}`, { state: { albumData } });
    };

    return (
        <Row className={style.mainContaier}>
            <Col sm='12' className={style.titleBox}>
                "{searchText}" 검색결과
            </Col>
            <Col sm='12' className={style.searchResult}>
                <Row>
                    <Col sm='6'>
                        <TrackSearchResult searchTracks={searchTracks} />
                    </Col>
                    <Col sm='6'>
                        <AlbumSearchResult searchAlbums={searchAlbums} />
                    </Col>
                </Row>
            </Col>

        </Row>
    )
}

export default ShowMusicList;