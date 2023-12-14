import React, { useState, useEffect, useContext } from "react";
import styles from "./Main.module.css";
import axios from "axios";
import { Link } from "react-router-dom"
import OwlCarousel from "./Carousel"
import RightSide from "./RightSide/RightSide";
import { LoginContext } from "../../App";

const Main = () => {
    const [recentMusic, setRecentMusic] = useState([]);
    const [selectTitle, setSelectTitle] = useState([]);
    const [selectImage, setSelectImage] = useState("");
    const [trackInfoByTag, setTrackInfoByTag] = useState({});
    const [trackLike,setLike] = useState([]);
    const { loginID, setLoginID } = useContext(LoginContext);
    const storageId = localStorage.getItem("loginID");
    const [isFavorite, setFavorite] = useState(0);

    const [flag, setFlag] = useState(true);
    
    useEffect(() => {
        axios.get("/api/track/recent")
            .then((res) => {
                console.log(loginID);
                setRecentMusic(res.data);
                if (res.data.length > 0 && res.data[0].trackImages && res.data[0].trackImages.length > 0) {
                    setSelectImage(res.data[0].trackImages[0].imagePath);
                }                
            })
            .catch((err) => {
                console.log(err);
            });
        
        axios.get("/api/MusicTag")
            .then((res) => {
                if(Array.isArray(res.data)) {
                    setSelectTitle(res.data);
                } else {
                    setSelectTitle([]);
                    console.log("Data is not an array:", res.data);
                }
            })
            .catch((err) => {
                console.log(err);
                setSelectTitle([]);
            });
            loadingLikes();
    }, [loginID]);

    const loadingLikes = async () => {
        axios.get(`/api/like/${storageId}`).then(res=>{
            console.log(res.data);
            setLike(res.data);
        }).catch((e)=>{
            console.log(e);
        });
    }

    useEffect(()=>{
        loadingLikes();
    },[isFavorite]);

    useEffect(() => {
        if (Array.isArray(selectTitle)) {
            selectTitle.forEach(tag => {
                if ([5, 6, 8, 9, 10, 12, 13, 14].includes(tag.tagId)) {
                    axios.get("/api/trackTag", { params: { tag: tag.tagId }})
                        .then((res) => {
                            setTrackInfoByTag(prevState => ({
                                ...prevState,
                                [tag.tagName]: res.data
                            }));
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                }
            });
        }
    }, [selectTitle]); 


    const handleSelectMusic = (music) => {
        if (music.trackImages && music.trackImages.length > 0) {
            setSelectImage(music.trackImages[0].imagePath);
            setFlag(false);
        }
    }

    
    return (
        <div className={styles.container}>
            <div className={styles.contentContainer}>
                <div className={styles.leftSide}>
                    <div className={styles.RecentTitle}>최신 업로드</div>
                    <div className={styles.RecentMusicBox}>
                        <img className={styles.RecentImg} src={`/tracks/image/${selectImage}`} alt={`/tracks/image/${selectImage}`}/>
                        <div className={styles.RecentMusic}>
                            {recentMusic.map((music, index) => { 
                                return (
                                    <div className={styles.RecentMusicOne} key={index} onClick={() => handleSelectMusic(music)}>
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
                    {Array.isArray(selectTitle) && selectTitle.filter(tag => [5, 6, 8, 9, 10, 12, 13, 14].includes(tag.tagId)).map((filterTag, index) => (
                        <div key={index}>
                            <div className={styles.carouselTitle}>{filterTag.tagName}</div>
                            <div className={styles.carousel}>
                                <OwlCarousel trackInfo={trackInfoByTag[filterTag.tagName]} trackLike={trackLike} setLike={setLike}/>
                            </div>
                        </div>
                    ))}

                    <div className={styles.leftBottom}></div>
                </div>
                <div className={styles.rightSide}>
                    <RightSide trackLike={trackLike} trackInfoByTag={trackInfoByTag}/>
                </div>
            </div>
        </div>
    );
}

export default Main;
