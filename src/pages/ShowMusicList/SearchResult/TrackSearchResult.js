import { Col, Row } from "reactstrap";
import style from "./TrackSearchResult.module.css"

const TrackSearchResult = ({ searchTracks }) => {

    console.log(searchTracks);


    return (
        <Row>
            {searchTracks.map((track, index) => (
                <Col sm='12' key={index}>
                    <div className={style.trackContainer}>
                        {track.trackImages && track.trackImages.length > 0 && (
                            <img src={`/tracks/image/${track.trackImages[0].imagePath}`} alt={`Image ${index + 1}`} style={{ width: '150px', height: '150px' }} />
                        )}
                        <div className={style.trackInfo}>
                            <h4>{track.title}</h4>
                            <p>Writer: {track.writer}</p>
                            {/* Add any other information you want to display */}
                        </div>
                    </div>
                </Col>
            ))}
        </Row>
    )
}

export default TrackSearchResult;