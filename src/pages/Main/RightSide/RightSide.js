import react, { useContext, useEffect, useState } from "react";
import styles from "./RightSide.module.css";
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import Like from "../assets/like.png"
import { LoginContext } from "../../../App";

const RightSide = ({trackLike,trackInfoByTag}) => {

    const [onlyLike, setOnlyLike] = useState([]);
    const { loginID } = useContext(LoginContext);
    
    const test =() => {
        console.log(onlyLike);
        console.log(loginID);
    }

    const findCommonTrack = (trackInfo, trackLike) => {
        return trackInfo.filter(infoItem =>
            trackLike.some(likeItem => likeItem.trackId === infoItem.track.trackId)
        );
    };    

    useEffect(()=>{
        const tagObjectsArray = Object.values(trackInfoByTag);
        const newArr = [];
        tagObjectsArray.forEach( item => newArr.push(...item));

        const commonTracks = findCommonTrack(newArr, trackLike);

        const uniqueTitlesArray = commonTracks.reduce((result, item) => {
            const existingItem = result.find(existing => existing.track.title === item.track.title);
            if (!existingItem) {
                result.push(item);
            }
            return result;
        }, []);

        const only3Music = uniqueTitlesArray.filter((e,i) => i < 3);

        setOnlyLike(only3Music);
        console.log(uniqueTitlesArray);
    },[trackLike]);
    return (
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
            
                {loginID != "" ? 
                    <ul className={styles.loveul}>
                        {onlyLike.map((e,i) => {
                        const trackImage = e.track.trackImages && e.track.trackImages.length > 0
                        ? `/tracks/image/${e.track.trackImages.imagePath}`
                        : "http://placehold.it/150x150";
                        return (
                            <li className={styles.loveli}>
                                <div className={styles.loveImg}>
                                    <img src={trackImage}></img>
                                </div>
                                <div>
                                    <div className={styles.loveSinger}>{e.track.title}</div>
                                    <PeopleAltIcon className={styles.lovePersonIcon} /> <div className={styles.lovePerson} onClick={test}>{e.track.writer ? e.track.writer : "unknown"}</div>
                                </div>
                            </li>
                        )
                    })}
                    </ul>
                :
                    <ul className={styles.loveul}>
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
                        <li className={styles.followli}>
                            <div className={styles.loveImg}></div>
                            <div>
                                <div className={styles.loveSinger}>오마이걸</div>
                                <PeopleAltIcon className={styles.lovePersonIcon} /> <div className={styles.lovePerson}>2.1만</div>
                            </div>
                        </li>
                    </ul>
                }
        </div>
    );
}

export default RightSide;