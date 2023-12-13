import react from "react";
import styles from "./RightSide.module.css";
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import Like from "../assets/like.png"

const RightSide = () => {
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
    );
}

export default RightSide;