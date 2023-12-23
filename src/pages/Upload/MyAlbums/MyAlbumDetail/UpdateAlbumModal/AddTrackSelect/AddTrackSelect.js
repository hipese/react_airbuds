import * as React from 'react';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';
import { Col, Row } from 'reactstrap';
import style from "./AddTrackSelect.module.css"


const AddTrackSelect = ({ handleClose, setAlbumUpdate, albumId }) => {

    const [myTracks, setMyTracks] = React.useState([]);
    const [addedTracks, setAddedTracks] = React.useState([]);

    React.useEffect(() => {
        axios.get("/api/track/LoginTracks").then(resp => {
            console.log(resp.data);
            setMyTracks(resp.data)
        })
    }, [])

    const handleAddTrack = (selectedTrack) => {
        const isTrackAdded = addedTracks.includes(selectedTrack.trackId);

        if (isTrackAdded) {
            setAlbumUpdate((prevAlbumUpdate) => ({
                ...prevAlbumUpdate,
                tracks: prevAlbumUpdate.tracks.filter(track => track.trackId !== selectedTrack.trackId),
            }));
            setAddedTracks(prevAddedTracks => prevAddedTracks.filter(trackId => trackId !== selectedTrack.trackId));
        } else {
            setAlbumUpdate((prevAlbumUpdate) => ({
                ...prevAlbumUpdate,
                tracks: [...prevAlbumUpdate.tracks, { ...selectedTrack, albumId: albumId }],
            }));
            setAddedTracks(prevAddedTracks => [...prevAddedTracks, selectedTrack.trackId]);
        }
    };

    const handleCancelTrack = (selectedTrack) => {
        setAlbumUpdate((prevAlbumUpdate) => ({
            ...prevAlbumUpdate,
            tracks: prevAlbumUpdate.tracks.filter(track => track.trackId !== selectedTrack.trackId),
        }));
        setAddedTracks(prevAddedTracks => prevAddedTracks.filter(trackId => trackId !== selectedTrack.trackId));
    };

    return (
        <React.Fragment>
            <DialogTitle id="alert-dialog-title">
                {"내 트랙 목록"}
            </DialogTitle>
            <DialogContent className={style.contentBox}>
                {myTracks
                    .filter(track => track.albumId === null) // albumId가 null인 것만 필터링
                    .map(track => (
                        <Row key={track.trackId} className={style.contents}>
                            <Col sm='3'>
                                {track.trackImages.length > 0 && (
                                    <img src={`/tracks/image/${track.trackImages[0].imagePath}`} alt="" className={style.image} />
                                )}
                            </Col>
                            <Col sm='9'>
                                <Row>
                                    <Col sm='12'>제목: {track.title}</Col>
                                    <Col sm='12'>제작자: {track.writer}</Col>
                                    <Col sm='12'>
                                        {addedTracks.includes(track.trackId) ? (
                                            <Button className={style.cancelButton} onClick={() => handleCancelTrack(track)}>
                                                취소하기
                                            </Button>
                                        ) : (
                                            <Button className={style.addButton} onClick={() => handleAddTrack(track)}>
                                                추가하기
                                            </Button>
                                        )}
                                    </Col>
                                </Row>
                            </Col>

                        </Row>
                    ))}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>닫기</Button>
            </DialogActions>

        </React.Fragment>
    )
}

export default AddTrackSelect;