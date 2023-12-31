import * as React from 'react';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
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
       
        // 추가 트랙에 해당 id값 없으면 넣고 있으면 안넣는다.
        if (isTrackAdded) {
            setAlbumUpdate((prevAlbumUpdate) => ({
                ...prevAlbumUpdate,
                tracks: prevAlbumUpdate.tracks.filter(track => track.trackId !== selectedTrack.trackId),
            }));
            setAddedTracks(prevAddedTracks => prevAddedTracks.filter(trackId => trackId !== selectedTrack.trackId));
        } else {

            const isAdd=window.confirm("앨범에 추가하시겠습니까?(확인을 클릭하면 바로 반영됩니다.)")
            if(!isAdd){
                return;
            }

            const formData = new FormData();

            formData.append("trackId",selectedTrack.trackId);
            formData.append("albumId",albumId);

            axios.post("/api/track/albumIdSave", formData).then(resp => {
                console.log("id추가 성공!!");
            })

            setAlbumUpdate((prevAlbumUpdate) => ({
                ...prevAlbumUpdate,
                tracks: [...prevAlbumUpdate.tracks, { ...selectedTrack, albumId: albumId }],
            }));
            setAddedTracks(prevAddedTracks => [...prevAddedTracks, selectedTrack.trackId]);
        }
    };

    const handleCancelTrack = (selectedTrack) => {

        const isAdd=window.confirm("앨범에서 제거하시겠습니까?(확인을 클릭하면 바로 반영됩니다.)")
        if(!isAdd){
            return;
        }
        
        const formData = new FormData();

        formData.append("trackId",selectedTrack.trackId);

        axios.post("/api/track/albumIdDelete", formData).then(resp => {
            console.log("id삭제 성공!!");
        })

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
                                    <img src={`${track.trackImages[0].imagePath}`} alt="" className={style.image} />
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