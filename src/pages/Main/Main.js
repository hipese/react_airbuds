import React from "react";
import styles from "./Main.module.css";
import { Link } from "react-router-dom"
import OwlCarousel from "./Carousel"

const Main = () => {
    
    return (
        <div className={styles.container} fluid>
            <div className={styles.contentContainer}>
                <div className={styles.leftSide}>
                    <div className={styles.RecentTitle}>최신 업로드</div>
                    <div className={styles.RecentMusicBox}>
                        <div className={styles.RecentImg}></div>
                        <div className={styles.RecentMusic}>
                            <div className={styles.RecentMusicOne}>
                                <div className={styles.RecentSinger}>IU</div>
                                <span>─</span>
                                <div className={styles.RecentSong}>여기다 넣으면 잘 됨</div>
                                <div className={styles.Listen}>
                                    <div className={styles.play}></div>
                                    <div className={styles.listenPerson}>4.3만</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.carouselTitle}>최근 유행하는 노래</div>
                    <div className={styles.carousel}>
                        <OwlCarousel />
                    </div>
                    <div className={styles.carouselTitle}>기분 좋을때</div>
                    <div className={styles.carousel}>
                        <OwlCarousel />
                    </div>
                    <div className={styles.carouselTitle}>파티</div>
                    <div className={styles.carousel}>
                        <OwlCarousel />
                    </div>

                    <div className={styles.leftBottom}></div>
                </div>
                <div className={styles.rightSide}>Like</div>
            </div>
        </div>
    );
}

export default Main;
