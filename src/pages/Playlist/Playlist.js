import react from "react";
import styles from "./Playlist.module.css";
import RightSide from "../Main/RightSide/RightSide";


const Playlist = () => {
    return (
        <div className={styles.container}>
            <div className={styles.contentContainer}>
                <div className={styles.leftSide}>
                    zz
                </div>
                <div className={styles.rightSide}>
                    <RightSide />
                </div>
            </div>
        </div>
    );
}

export default Playlist;