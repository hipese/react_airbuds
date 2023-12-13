import React, { useState, useRef, useContext, useEffect } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import './BottomMusic.css';
import styles from "./BottomMusic.module.css";
import axios from "axios"
import { MusicContext } from '../../../App';

const BottomMusic = () => {
    const { audioFiles, setAudioFiles } = useContext(MusicContext);
    const [isPlaying, setIsPlaying] = useState(false);
    const [loading, setLoading] = useState(false);
    const audioRef = useRef(null);
    const [currentTrack, setCurrentTrack] = useState(0);


    // 데이터베이스에 음원경로만 가져오는 변수
    const [tracks, setTracks] = useState([]);

    const testText = "잉여";

    // useEffect(() => {
    //     axios.get(`/api/track/bywriter/${testText}`)
    //         .then(resp => {
    //             const newTracks = resp.data.map(track => "/tracks/" + track.filePath);
    //             const updatedAudioFiles = [...audioFiles, ...newTracks];
    //             setAudioFiles(updatedAudioFiles);
    //         })
    //         .catch(error => {
    //             console.error("Error fetching data:", error);
    //         });
    // }, []);


    // audioFiles 상태가 변경될 때마다 로그 출력
    // useEffect(() => {
    //     console.log("Updated audio files:", audioFiles);
    // }, [audioFiles]);

    // if (audioFiles.length === 0) {
    //     return null; // If empty, don't render anything
    // };



    const handlePlay = () => {
        setIsPlaying(true);
        setLoading(true);
    };

    const handlePause = () => {
        setIsPlaying(false);
    };

    const handleLoadedData = () => {
        setLoading(false);
    };

    const handleNextTrack = () => {
        const nextTrack = (currentTrack + 1) % audioFiles.length;
        setCurrentTrack(nextTrack);
    };

    const handlePreviousTrack = () => {
        // Logic for moving to the previous track
        const previousTrack = (currentTrack - 1 + audioFiles.length) % audioFiles.length;
        setCurrentTrack(previousTrack);
    };

    const handleEnded = () => {
        // Callback for when the audio ends
        // Automatically move to the next track
        handleNextTrack();
        // You can also add additional logic here
    };

    return (
        <div className={styles.container}>
            <div className={styles.imageContainer}>
                <img
                    src="/logo512.png"
                    alt="Description of the image"
                    className={styles.image}
                />
            </div>
            <AudioPlayer
                autoPlayAfterSrcChange={true}
                src={audioFiles[currentTrack]}
                showJumpControls={true}
                customAdditionalControls={[
                    <div className={styles.song_info}>
                        <div className={styles.title}>groovy</div>
                        <div className={styles.singer}>groovy.project</div>
                    </div>
                ]}
                showSkipControls={true}
                onPlay={handlePlay}
                onPause={handlePause}
                onLoadedData={handleLoadedData}
                onClickNext={handleNextTrack}
                onClickPrevious={handlePreviousTrack}
                onEnded={handleEnded}
                ref={audioRef}
            />
        </div>
    );
}

export default BottomMusic;