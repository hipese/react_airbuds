import React, { useState, useRef } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import './BottomMusic.css';
import styles from "./BottomMusic.module.css";

const BottomMusic = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [loading, setLoading] = useState(false);
    const audioRef = useRef(null);

    const audioFiles = [
        'https://raw.githubusercontent.com/himalayasingh/music-player-1/master/music/2.mp3',
        'https://raw.githubusercontent.com/himalayasingh/music-player-1/master/music/3.mp3',
        'https://raw.githubusercontent.com/himalayasingh/music-player-1/master/music/4.mp3',
        'https://raw.githubusercontent.com/himalayasingh/music-player-1/master/music/5.mp3',
        // Add more audio URLs as needed
    ];

    const [currentTrack, setCurrentTrack] = useState(0);

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