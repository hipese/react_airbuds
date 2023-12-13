import React, { useState, useRef, useContext, useEffect } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import './BottomMusic.css';
import styles from "./BottomMusic.module.css";
import axios from "axios"
import { CurrentTrackContext, LoginContext, MusicContext, TrackContext, TrackInfoContext } from '../../../App';
import { PlayingContext } from '../../../App';

const BottomMusic = () => {
    const { audioFiles, setAudioFiles } = useContext(MusicContext);
    const { isPlaying, setIsPlaying } = useContext(PlayingContext);
    const [loading, setLoading] = useState(false);
    const audioRef = useRef(null);
    const { currentTrack, setCurrentTrack } = useContext(CurrentTrackContext);
    const { track_info, setTrack_info } = useContext(TrackInfoContext);
    const { tracks, setTracks } = useContext(TrackContext);
    const { loginID, setLoginID } = useContext(LoginContext);

    useEffect(() => {

        if (!loginID) {
            return;
        }

        axios.get(`/api/track/findById/${loginID}`).then(resp => {
            const tracksWithImages = resp.data.map(track => {
                const imagePath = track.trackImages.length > 0 ? track.trackImages[0].imagePath : null;
                const newTracks = resp.data.map(track => "/tracks/" + track.filePath);
                const updatedAudioFiles = [...audioFiles, ...newTracks];
                setAudioFiles(updatedAudioFiles);
                return { ...track, imagePath };
            });

            setTracks(tracksWithImages);
            const firstTrackInfo = tracksWithImages[0];
            setTrack_info({
                title: firstTrackInfo.title,
                writer: firstTrackInfo.writer,
                imagePath: firstTrackInfo.imagePath
            });
            setIsPlaying(false);
        });
    }, [loginID]);



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
        //console.log(currentTrack);
    };

    const handlePause = () => {
        setIsPlaying(false);
    };

    const handleLoadedData = () => {
        setLoading(false);
    };

    const handleNextTrack = () => {
        const nextTrack = (currentTrack + 1) % audioFiles.length;

        // 'tracks' 상태에서 다음 곡의 정보를 가져옵니다.
        const nextTrackInfo = tracks[nextTrack];

        // 곡 정보 컨텍스트를 업데이트합니다.
        setTrack_info({
            title: nextTrackInfo.title,
            writer: nextTrackInfo.writer,
            imagePath: nextTrackInfo.imagePath
        });

        // 현재 재생 중인 트랙을 업데이트합니다.
        setCurrentTrack(nextTrack);
    };

    const handlePreviousTrack = () => {
        // 이전 트랙으로 이동하는 논리
        let previousTrack = (currentTrack - 1 + audioFiles.length) % audioFiles.length;

        // 만약 현재 트랙이 0보다 작다면 마지막 트랙으로 이동
        if (previousTrack < 0) {
            previousTrack = audioFiles.length - 1;
        }

        // 'tracks' 상태에서 이전 곡의 정보를 가져옵니다.
        const previousTrackInfo = tracks[previousTrack];

        // 곡 정보 컨텍스트를 업데이트합니다.
        setTrack_info({
            title: previousTrackInfo.title,
            writer: previousTrackInfo.writer,
            imagePath: previousTrackInfo.imagePath
        });

        // 현재 재생 중인 트랙을 업데이트합니다.
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
                    src={`/tracks/image/${track_info.imagePath}`}
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
                        <div className={styles.title}>{track_info.title ?? '알 수 없는 제목'}</div>
                        <div className={styles.singer}>{track_info.writer ?? '알 수 없는 작곡가'}</div>
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