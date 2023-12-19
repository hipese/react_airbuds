import { Button, Col, Row } from "reactstrap";
import YourTrackList from "./YourTrackList/YourTrackList";
import styles from "./YourTracks.module.css";



const YourTracks = () => {
    return (
        <div className={styles.container}>
            <Row>
                <Col sm="12" className={styles.introduction}>
                    <Row>
                        <Col sm="12" className={styles.gateText}>Your tracks</Col>
                        <Col sm="12">sdsdss</Col>
                    </Row>
                </Col>
                <Col sm="12"> <YourTrackList /></Col>
                <Col sm="12" className={styles.endcol}><Button>다른 음원 업로드</Button></Col>
            </Row>

        </div>
    );
};


export default YourTracks;
