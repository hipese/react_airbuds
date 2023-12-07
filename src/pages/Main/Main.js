import React, {useState} from "react";
import styles from "./Main.module.css";
import { Link } from "react-router-dom"
import OwlCarousel from "./Carousel"
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import Like from "./assets/like.png"

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
                <div className={styles.rightSide}>
                    <div className={styles.positionFixed}>
                        <div className={styles.followArtist}><GroupAddIcon className={styles.followIcon} />팔로우한 아티스트<div className={styles.viewAll}>더보기</div></div>
                        <ul className={styles.followul}>
                            <li className={styles.followli}>
                                <div className={styles.followImg}></div>
                                <div>
                                    <div className={styles.followSinger}>아이유</div>
                                    <PeopleAltIcon className={styles.followPersonIcon} /> <div className={styles.followPerson}>4.3만</div>
                                </div>
                            </li>
                            <li className={styles.followli}>
                                <div className={styles.followImg}></div>
                                <div>
                                    <div className={styles.followSinger}>오마이걸</div>
                                    <PeopleAltIcon className={styles.followPersonIcon} /> <div className={styles.followPerson}>2.1만</div>
                                </div>
                            </li>
                            <li className={styles.followli}>
                                <div className={styles.followImg}></div>
                                <div>
                                    <div className={styles.followSinger}>티아라</div>
                                    <PeopleAltIcon className={styles.followPersonIcon} /> <div className={styles.followPerson}>3.7만</div>
                                </div>
                            </li>
                        </ul>
                        <div className={styles.loveYou}><img src={Like} alt="..." className={styles.like} />좋아요<div className={styles.viewAll}>더보기</div></div>
                        <ul className={styles.loveul}>
                            <li className={styles.loveli}>
                                <div className={styles.loveImg}></div>
                                <div>
                                    <div className={styles.loveSinger}>아이유</div>
                                    <PeopleAltIcon className={styles.lovePersonIcon} /> <div className={styles.lovePerson}>4.3만</div>
                                </div>
                            </li>
                            <li className={styles.followli}>
                                <div className={styles.loveImg}></div>
                                <div>
                                    <div className={styles.loveSinger}>오마이걸</div>
                                    <PeopleAltIcon className={styles.lovePersonIcon} /> <div className={styles.lovePerson}>2.1만</div>
                                </div>
                            </li>
                            <li className={styles.followli}>
                                <div className={styles.loveImg}></div>
                                <div>
                                    <div className={styles.loveSinger}>티아라</div>
                                    <PeopleAltIcon className={styles.lovePersonIcon} /> <div className={styles.lovePerson}>3.7만</div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Main;
