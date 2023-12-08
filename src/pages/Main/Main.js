import React, { useState, useEffect } from "react";
import styles from "./Main.module.css";
import axios from "axios";
import { Link } from "react-router-dom"
import OwlCarousel from "./Carousel"
import RightSide from "./RightSide/RightSide";

const Main = () => {
    const [recentMusic, setRecentMusic] = useState([]);
    const [trackInfo, setTrackInfo] = useState([]);
    
    useEffect(() => {
        axios.get("/api/track/recent")
            .then((res) => {
                setRecentMusic(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
        axios.get("/api/trackTag/romance")
            .then((res) => {
                setTrackInfo(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    
    return (
        <div className={styles.container}>
            <div className={styles.contentContainer}>
                <div className={styles.leftSide}>
                    <div className={styles.RecentTitle}>최신 업로드</div>
                    <div className={styles.RecentMusicBox}>
                        <div className={styles.RecentImg}></div>
                        <div className={styles.RecentMusic}>
                            {recentMusic.map((music, index) => { 
                                return (
                                    <div className={styles.RecentMusicOne} key={index}>
                                        <div className={styles.RecentTitleAndSinger}>
                                            <div className={styles.RecentSinger}>{music.writer}</div>
                                            <span>─</span>
                                            <div className={styles.RecentSong}>{music.title}</div>
                                        </div>
                                        <div className={styles.Listen}>
                                            <div className={styles.play}></div>
                                            <div className={styles.listenPerson}>{music.viewCount}명</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className={styles.carouselTitle}>최근 유행하는 노래</div>
                    <div className={styles.carousel}>
                        <OwlCarousel />
                    </div>
                    <div className={styles.carouselTitle}>로맨틱한</div>
                    <div className={styles.carousel}>
                        <OwlCarousel trackInfo={trackInfo} />
                    </div>
                    <div className={styles.carouselTitle}>기분 좋을때</div>
                    <div className={styles.carousel}>
                        <OwlCarousel />
                    </div>

                    <div className={styles.leftBottom}></div>
                </div>
                <div className={styles.rightSide}>
                    <RightSide />
                </div>
            </div>
        </div>
    );
}

export default Main;
