import { useLocation } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import ShareIcon from '@mui/icons-material/Share';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import style from "./MyAlbumDetail.module.css";
import Modal from '@mui/material/Modal';
import { useState } from 'react';
import UpdateAlbumModal from './UpdateAlbumModal/UpdateAlbumModal';

const MyAlbumDetail = () => {

    const location = useLocation();
    const albumData = location.state.albumData;

    const [albumUpdate, setAlbumUpdate] = useState(albumData); 

    const handleUpdateAlbum = (updatedAlbumData) => {
        setAlbumUpdate(updatedAlbumData); 
    };

    // 모달창을 띄우기 위한 변수
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


    // 앨범 작성자들의 이름을 추출하여 문자열로 합치는 함수
    const albumWriters = albumUpdate.albumWriter.map(writer => writer.artistNickname).join(', ');
    return (
        <div className={style.album_detail_container}>
            <Row>
                <Col sm='12'>
                    <div className={style.button_group}>
                        <Button className={style.button_custom}>
                            <ShareIcon className={style.icon_custom} />
                            Share
                        </Button>
                        <Button className={style.button_custom}>
                            <ContentCopyIcon className={style.icon_custom} />
                            Copy Link
                        </Button>
                        <Button className={style.button_custom} onClick={handleOpen}>
                            <EditIcon className={style.icon_custom} />
                            Edit

                        </Button>
                        <Button className={style.button_custom}>
                            <PlaylistAddIcon className={style.icon_custom} />
                            Add to Next up
                        </Button>
                        <Button className={style.button_custom}>
                            <DeleteIcon className={style.icon_custom} />
                            Delete playlist
                        </Button>
                    </div>
                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <UpdateAlbumModal 
                        albumUpdate={albumUpdate} 
                        onUpdateAlbum={handleUpdateAlbum}
                        onClose={handleClose} 
                        />
                    </Modal>
                </Col>
                <Col sm='12'>
                    <div className={style.album_image}>
                        <img src={`/tracks/image/${albumUpdate.coverImagePath}`} alt={albumUpdate.title} />
                    </div>
                </Col>
                <Col sm='12'>
                    <div className={style.album_info}>
                        <h2>{albumUpdate.title}</h2>
                        <p className={style.writers}>Writers: {albumWriters}</p>
                        <div className={style.album_tracks}>
                            {albumUpdate.tracks.map((track, index) => (
                                <div key={index} className={style.track}>
                                    <span className={style.track_number}>{index + 1}.</span>
                                    <span className={style.track_title}>{track.title}</span>
                                    <span className={style.track_duration}>{track.duration}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    )

}

export default MyAlbumDetail;