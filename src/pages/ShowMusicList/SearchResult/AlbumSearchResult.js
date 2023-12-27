
import { Col, Row } from "reactstrap"
import style from "./AlbumSearchresult.module.css"
import { useNavigate } from "react-router";


const AlbumSearchResult = ({ searchAlbums }) => {

    const navigate=useNavigate();

    const handleAlbumDtail = (albumId, albumData) => {
        navigate(`/Album/Detail/${albumId}`, { state: { albumData } });
    };


    return (
        <Row className={style.album_detail_container}>
            {searchAlbums.map((album, index) => (
                <Row key={index} className={style.container}>
                    <Col sm='12' lg='12' xl='3'>
                        <Row className={style.mainAlbumTitle}>
                            <Col sm="12">
                            <a href={`/Album/Detail/${album.id}`} onClick={() => handleAlbumDtail(album.id, album)}>
                                <div className={style.album_image}>
                                    <img src={`/tracks/image/${album.coverImagePath}`} alt={album.title} style={{ width: '150px', height: '150px' }} />
                                </div>
                            </a>
                            </Col>
                            <Col sm="12" className={style.album_title}>
                                <h3>{album.title}</h3>
                            </Col>
                            <Col sm="12" className={style.album_writer}>
                                {[...new Set(album.tracks.map(track => track.writer))].join(', ')}
                            </Col>
                        </Row>
                    </Col>

                    <Col sm='12'  lg='12' xl='9' className={style.trackBox}>
                        {album.tracks.slice(0, 3).map((track, trackIndex) => (
                           <Row key={trackIndex} className={style.track}>
                                <Col sm="12" md="1" className={style.trackCol}>
                                    <img
                                        src={`/tracks/image/${track.trackImages?.[0]?.imagePath}`}
                                        alt=""
                                        style={{ width: '40px', height: '40px', marginBottom: '10px',marginTop: '10px' }}
                                    />
                                </Col>
                                <Col sm="12" md="1">
                                    {trackIndex+1}
                                </Col>
                                <Col sm="12" md="8">
                                    {track.title}
                                </Col>
                                <Col sm="12" md="2">
                                    {track.duration}
                                </Col>
                            </Row>
                        ))}
                        {album.tracks.length > 3 && (
                            <p>and {album.tracks.length - 3} more...</p>
                        )}
                    </Col>
                </Row>
            ))}
       </Row>
    );
}

export default AlbumSearchResult;