import { Button, Col, Row } from "reactstrap";
import YourTrackList from "./YourTrackList/YourTrackList";
import styles from "./YourTracks.module.css";
import { useNavigate } from "react-router";


const YourTracks = () => {

    const navigator=useNavigate();

    const handleAddTrack=()=>{
        navigator("/Upload");
    }

    return (
        <div className={styles.container}>
            <Row>
                <Col sm="12" className={styles.introduction}>
                    <Col sm="12" className={styles.gateText}>
                        Your tracks
                    </Col>
                    <hr />
                </Col>
                <Col sm="12" className={styles.trackListBox}>
                     <YourTrackList />
                </Col>
                <Col sm="12" className={styles.endcol}><Button onClick={handleAddTrack}>다른 음원 업로드</Button></Col>
            </Row>

        </div>
    );
};


export default YourTracks;
