import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import ShareIcon from '@mui/icons-material/Share';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import style from "./MyAlbumDetail.module.css";
import Modal from '@mui/material/Modal';
import { useContext, useEffect, useState } from 'react';
import UpdateAlbumModal from './UpdateAlbumModal/UpdateAlbumModal';
import axios from 'axios';
import { AutoPlayContext, CurrentTrackContext, LoginContext, MusicContext, PlayingContext, TrackContext, TrackInfoContext } from '../../../../App';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';

const MyAlbumDetail = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const albumData = location.state.albumData;


    const { loginID, setLoginID } = useContext(LoginContext);
    const [albumUpdate, setAlbumUpdate] = useState(albumData);
    const [backUpAlbum, setBackUpAlbum] = useState(albumData);
    const [isEditAlbum, setIsEditAlbum] = useState(false);
    const { audioFiles, setAudioFiles } = useContext(MusicContext);
    const { isPlaying, setIsPlaying } = useContext(PlayingContext);
    const { currentTrack, setCurrentTrack } = useContext(CurrentTrackContext);
    const { track_info, setTrack_info } = useContext(TrackInfoContext);
    const { tracks, setTracks } = useContext(TrackContext);
    const { autoPlayAfterSrcChange, setAutoPlayAfterSrcChange } = useContext(AutoPlayContext);

    // 모달창을 띄우기 위한 변수
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);


    useEffect(() => {
        axios.get(`/api/album/isEdit/${albumData.artistId}`).then(resp => {
            setIsEditAlbum(resp.data);
        })

    }, [loginID])

    const handleCancle = () => {
        setOpen(false);
        axios.get(`/api/album/findByAlbumId/${backUpAlbum.albumId}`).then(resp => {
            setAlbumUpdate(resp.data);
        })
    };

    const handleModalClose = (event, reason) => {
        if (reason && reason === "backdropClick") {
            handleCancle();
        } else {
            handleCancle();
        }
    };

    const hnadleCarousel = () => {
        navigate('/Upload/myAlbums');
    }



    const handledelete = () => {
        const isDeleteConfirmed = window.confirm("정말로 삭제하시겠습니까? (트랙도 전부 삭제됩니다.)");
        if (isDeleteConfirmed) {
            axios.delete(`/api/album/delete/${albumUpdate.albumId}`).then(resp => {
                navigate('/Upload/myAlbums');
            })
        }

    }
    // 앨범 작성자들의 이름을 추출하여 문자열로 합치는 함수
    const uniqueWriters = [...new Set(albumUpdate.tracks.map(track => track.writer))];
    const albumWriters = uniqueWriters.join(', ');


    const addTrackToPlaylist = (track) => {
        console.log(track);
        const tracksWithImages = track.map((track) => {
            setAutoPlayAfterSrcChange(true);
            const imagePath = track.trackImages.length > 0 ? track.trackImages[0].imagePath : null;
            return { ...track, imagePath };
        });
        console.log(tracksWithImages);

        const { trackId, filePath, imagePath, title, writer } = tracksWithImages[0];
        // Update TrackInfoContext with the selected track information
        setTrack_info({
            trackId,
            filePath,
            imagePath,
            title,
            writer
        });

        axios.post(`/api/cplist`, {
            trackId: trackId,
            id: loginID
        }).then(resp => {

        })

        const newAudioFiles = track.map(track => `${track.filePath}`);

        console.log(newAudioFiles);
        setAutoPlayAfterSrcChange(true);

        // 현재 트랙을 중지하고 새 트랙을 재생 목록에 추가하고 재생 시작
        setAudioFiles((prevAudioFiles) => [...newAudioFiles, ...prevAudioFiles]);
        setCurrentTrack(0);
        setIsPlaying(true);

        // // Update the state with the new array of tracks
        setTracks((prevTracks) => [...tracksWithImages, ...prevTracks]);
    };

    return (
        <div className={style.album_detail_container}>
            <Row>
                <Col sm='12'>
                    <div className={style.button_group}>
                        <Button className={style.button_custom} onClick={hnadleCarousel}>
                            돌아가기
                        </Button>
                        <Button className={style.button_custom}>
                            <ShareIcon className={style.icon_custom} />
                            Share
                        </Button>
                        <Button className={style.button_custom}>
                            <ContentCopyIcon className={style.icon_custom} />
                            Copy Link
                        </Button>

                        {isEditAlbum && (
                            <Button className={style.button_custom} onClick={handleOpen}>
                                <EditIcon className={style.icon_custom} />
                                수정
                            </Button>
                        )}

                        {isEditAlbum && (
                            <Button className={style.button_custom} onClick={handledelete}>
                                <DeleteIcon className={style.icon_custom} />
                                앨범삭제
                            </Button>
                        )}
                    </div>
                    <Modal
                        open={open}
                        onClose={handleModalClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <UpdateAlbumModal
                            albumUpdate={albumUpdate}
                            setAlbumUpdate={setAlbumUpdate}
                            onClose={handleCancle}
                        />
                    </Modal>
                    <hr />
                </Col>
                <Col sm='12'>
                    <Row>
                        <Col sm='12' lg='12' xl='3'>
                            <Row className={style.mainAlbumTitle}>
                                <Col sm='12'>
                                    <div className={style.album_image}>
                                        <img src={`${albumUpdate.coverImagePath}`} alt={albumUpdate.title} />
                                    </div>
                                </Col>
                                <Col sm='12' className={style.album_image}>
                                    <h2>{albumUpdate.title}</h2>
                                </Col>
                                <Col sm='12' className={style.album_image}>
                                    {albumWriters}
                                </Col>
                                <div className={style.play_button} >
                                    <PlayCircleIcon sx={{ width: '200px', height: '200px' }} onClick={() => addTrackToPlaylist(albumUpdate.tracks)} />
                                </div>
                            </Row>
                        </Col>
                        <Col sm='12' lg='12' xl='9'>
                            <Row>
                                <Col sm='12' md='2' className={style.AlbumCols}>

                                </Col>
                                <Col sm='12' md='4' className={style.AlbumCols}>
                                    제목
                                </Col>
                                <Col sm='12' md='4' className={style.AlbumCols}>
                                    작곡가
                                </Col>
                                <Col sm='12' md='2' className={style.AlbumCols}>
                                    재생시간
                                </Col>
                            </Row>
                            {albumUpdate.tracks.map((track, index) => (
                                <div key={index} className={style.track}>
                                    <Col sm='12' md='1' className={style.trackCol}>
                                        <img src={`${track.trackImages[0].imagePath}`} alt="" style={{ width: '50px', height: '50px', marginBottom: '10px' }} />
                                    </Col>
                                    <Col sm='12' md='5'>
                                        {track.title}
                                    </Col>
                                    <Col sm='12' md='4'>
                                        {track.writer}
                                    </Col>
                                    <Col sm='12' md='2'>
                                        {track.duration}
                                    </Col>
                                </div>
                            ))}
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    )

}

export default MyAlbumDetail;