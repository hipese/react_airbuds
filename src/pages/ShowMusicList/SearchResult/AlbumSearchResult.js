
import { Col, Row } from "reactstrap"
import style from "./AlbumSearchresult.module.css"


const AlbumSearchResult = ({ searchAlbums }) => {

    console.log(searchAlbums)

    return (
        <Row>
            {searchAlbums.map((album, index) => (
                 <Row key={index}>
                     <Col sm='12'  lg='12' xl='12'>
                        <Row className={style.mainAlbumTitle}>
                            <Col sm="12">
                                <div className={style.album_image}>
                                    <img src={`/tracks/image/${album.coverImagePath}`} alt={album.title} style={{ width: '150px', height: '150px' }} />
                                </div>
                            </Col>
                            <Col sm="12" className={style.album_image}>
                                <h2>{album.title}</h2>
                            </Col>
                            <Col sm="12" className={style.album_image}>
                                <p>{[...new Set(album.tracks.map(track => track.writer))].join(', ')}</p>
                            </Col>
                        </Row>
                    </Col>

                    {/* <Col sm='12'  lg='12' xl='8'>
                        {album.tracks.map((track, trackIndex) => (
                           <Row key={trackIndex}>
                                <Col sm="12" md="2" className={style.trackCol}>
                                    <img
                                        src={`/tracks/image/${track.trackImages?.[0]?.imagePath}`}
                                        alt=""
                                        style={{ width: '50px', height: '50px', marginBottom: '10px' }}
                                    />
                                </Col>
                                <Col sm="12" md="8">
                                    {track.title}
                                </Col>
                                <Col sm="12" md="2">
                                    {track.duration}
                                </Col>
                            </Row>
                        ))}
                    </Col> */}
                </Row>
            ))}
        </Row>
    );
}

export default AlbumSearchResult;