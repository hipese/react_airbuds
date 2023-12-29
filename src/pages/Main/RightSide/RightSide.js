import react, { useContext, useEffect, useState } from "react";
import styles from "./RightSide.module.css";
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import Like from "../assets/like.png"
import { LoginContext } from "../../../App";
import { useNavigate } from "react-router";
import axios from "axios";
import { Link } from "react-router-dom";

const RightSide = ({trackLike,trackInfoByTag}) => {

    const [onlyLike, setOnlyLike] = useState([]);
    const [artist,setArtist] = useState([]);
    const { loginID } = useContext(LoginContext);
    const navi = useNavigate();
    
    const test =() => {
        navi("/dashboard");
    }

    const findCommonTrack = (trackInfo, trackLike) => {
        return trackInfo.filter(infoItem =>
            trackLike.some(likeItem => likeItem.trackId === infoItem.track.trackId)
        );
    };
    const sideLoading = async () => {
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

        const sortedData = uniqueTitlesArray.sort((a, b) => b.track.trackId - a.track.trackId);

        const threeData = sortedData.filter((e,i)=>i < 3);

        await new Promise(()=>{
            setOnlyLike(threeData);
        });
    }

    useEffect(()=>{
        axios.get(`/api/like/follwingData/${loginID}`).then(res=>{
            console.log(res.data);
            const sortedData = res.data.sort((a, b) => b.followerNumber - a.followerNumber);
            const threeData = sortedData.filter((e,i)=>i < 3);
            setArtist(threeData);
        }).catch((e)=>{
            console.log(e);
        });
    },[loginID!==""]);

    useEffect(()=>{        
        sideLoading();        
    },[trackLike]);

    const handleMoveToProfile = (id) => {
        navi(`/profile/${id}`);
    }

    const handleMoveToMusicDetail = (trackId) => {
        navi(`/Detail/${trackId}`);
    }

    const handleMoveToPlus = (location) => {
        navi(`/Library/${location}`);
    }
    
    return (
        <div className={styles.positionFixed}>
            <div className={styles.followArtist}><GroupAddIcon className={styles.followIcon} />팔로우한 아티스트<div className={styles.viewAll} onClick={()=>(handleMoveToPlus("following"))}>더보기</div></div>
                {loginID != "" ? 
                        <ul className={styles.loveul}>
                            {artist.map((e,i) => {
                            const trackImage = e.profile_image && e.profile_image > 0
                            ? `${e.profile_image}`
                            : "http://placehold.it/150x150";
                            return (
                                <div key={i} onClick={() => {handleMoveToProfile(e.singer)}}>
                                    <li className={styles.loveli}>
                                        <div className={styles.loveImg}>
                                            <img src={trackImage} width={50} height={50}></img>
                                        </div>
                                        <div>
                                            <div className={styles.loveSinger}>{e.singer}</div>
                                            <PeopleAltIcon className={styles.lovePersonIcon} /> <div className={styles.lovePerson}>{e.followerNumber ? e.followerNumber : "0"}</div>
                                        </div>
                                    </li>
                                </div>
                            )
                        })}
                        </ul>
                    :
                        <ul className={styles.loveul}>
                            <li className={styles.followli}>
                                <div>
                                </div>
                            </li>
                            <li className={styles.followli}>
                                <div>
                                </div>
                            </li>
                            <li className={styles.followli}>
                                <div>
                                </div>
                            </li>
                        </ul>
                    }
            <div className={styles.loveYou}><img src={Like} alt="..." className={styles.like} />좋아요<div className={styles.viewAll} onClick={()=>(handleMoveToPlus("likes"))}>더보기</div></div>
            
                {loginID != "" ? 
                    <ul className={styles.loveul}>
                        {onlyLike.map((e,i) => {
                        const trackImage = e.track.trackImages && e.track.trackImages.length > 0
                        ? `${e.track.trackImages[0].imagePath}`
                        : "http://placehold.it/150x150";
                        return (
                            <div onClick={()=>{
                                    handleMoveToMusicDetail(e.track.trackId);
                                    // addStreamCount(e.track.trackId,e.track.writer,null);   //노래 스트리밍 카운트를 증가하는 메서드.
                                }
                            }>
                                <li key={i} className={styles.loveli}>
                                    <div className={styles.loveImg}>
                                        <img src={trackImage} width={50} height={50}></img>
                                    </div>
                                    <div>
                                        <div className={styles.loveSinger}>{e.track.title}</div>
                                        <PeopleAltIcon className={styles.lovePersonIcon} /> <div className={styles.lovePerson}>{e.track.writer ? e.track.writer : "unknown"}</div>
                                    </div>
                                </li>
                            </div>
                        )
                    })}
                    </ul>
                :
                    <ul className={styles.loveul}>
                    </ul>
                }
        </div>
    );
}

export default RightSide;