import react from "react";
import styles from "./TopNavigator.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";
import SVGComponent from "./SVGComponent";

const TopNavigator = () => {
    return (
        <Container className={`${styles.container} ${styles.containerFluid}`} fluid>
            <Row>
                <Col className={styles.header_left}>
                    <Row>
                        <Col>
                            <Link className={styles.linksvg} to="/"><SVGComponent /></Link>
                        </Col>
                        <Col>
                            <Link className={styles.linkurl} to="/"><div>홈</div></Link>
                        </Col>
                        <Col>
                            <Link className={styles.linkurl} to="/Feed"><div>피드</div></Link>
                        </Col>
                        <Col>
                            <Link className={styles.linkurl} to="/Library"><div>라이브러리</div></Link>
                        </Col>
                    </Row>
                </Col>
                <Col className={styles.header_center}>
                    <Row>
                        <Col className={styles.search}>
                            <input className={styles.searchbar} type="text" placeholder="Search..."></input>
                            <img src={`/assets/Search.svg`} alt="" className={styles.search_icon} />
                        </Col>
                    </Row>
                </Col>
                <Col className={styles.header_right}>
                    <Row>
                        <Col>
                            <Link className={styles.linkurl} to="/Playlist"><div>플레이리스트</div></Link>
                        </Col>
                        <Col>
                            <Link className={styles.linkurl} to="/Upload"><div>업로드</div></Link>
                        </Col>
                        <Col>
                        <Link className={styles.linkurl} to="/Music"><div>프로필</div></Link>
                        </Col>
                        <Col>
                            ...
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}

export default TopNavigator;