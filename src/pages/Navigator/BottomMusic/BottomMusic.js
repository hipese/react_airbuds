import React, { useState, useRef, useContext, useEffect } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import './BottomMusic.css';
import styles from "./BottomMusic.module.css";
import axios from "axios"
import { AutoPlayContext, CurrentTrackContext, LoginContext, MusicContext, TrackContext, TrackInfoContext } from '../../../App';
import { PlayingContext } from '../../../App';
import { Link } from 'react-router-dom';

const BottomMusic = () => {
    const { audioFiles, setAudioFiles } = useContext(MusicContext);
    const { isPlaying, setIsPlaying } = useContext(PlayingContext);
    const [loading, setLoading] = useState(false);
    const audioRef = useRef(null);
    const { currentTrack, setCurrentTrack } = useContext(CurrentTrackContext);
    const { track_info, setTrack_info } = useContext(TrackInfoContext);
    const { tracks, setTracks } = useContext(TrackContext);
    const { loginID, setLoginID } = useContext(LoginContext);
    const { autoPlayAfterSrcChange, setAutoPlayAfterSrcChange } = useContext(AutoPlayContext);

    useEffect(() => {

        if (!loginID) {
            return;
        }

        axios.get(`/api/cplist/all`).then(resp => {

            const allTracks = [];
            const updatedAudioFiles = [];

            resp.data.forEach((trackItem, outerIndex) => {
                trackItem.tracks.forEach((innerTrack, innerIndex) => {
                    const imagePath = innerTrack.trackImages.length > 0 ? innerTrack.trackImages[0].imagePath : null;
                    const newTrackPath = "/tracks/" + innerTrack.filePath;
                    updatedAudioFiles.push(newTrackPath);
                    allTracks.push({ ...innerTrack, imagePath });
                });
            });
            // const tracksWithImages = resp.data.map(track => {
            //     const imagePath = track.trackImages.length > 0 ? track.trackImages[0].imagePath : null;
            //     const newTracks = resp.data.map(track => "/tracks/" + track.filePath);
            //     const updatedAudioFiles = [...audioFiles, ...newTracks];
            //     setAudioFiles(updatedAudioFiles);
            //     return { ...track, imagePath };
            // });
            setAudioFiles(updatedAudioFiles);
            setTracks(allTracks);
            const firstTrackInfo = allTracks[0];
            setTrack_info({
                trackId: firstTrackInfo?.trackId ?? '0',
                title: firstTrackInfo?.title ?? '알 수 없는 제목',
                writer: firstTrackInfo?.writer ?? '알 수 없는 작곡가',
                imagePath: firstTrackInfo?.imagePath ?? ''
            });
        });
    }, [loginID]);

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
        if (!loginID) {
            // If loginID is not available, do nothing
            return;
        }
        const nextTrack = (currentTrack + 1) % audioFiles.length;

        // 'tracks' 상태에서 다음 곡의 정보를 가져옵니다.
        const nextTrackInfo = tracks[nextTrack];

        // 곡 정보 컨텍스트를 업데이트합니다.
        setTrack_info({
            trackId: nextTrackInfo.trackId,
            title: nextTrackInfo.title,
            writer: nextTrackInfo.writer,
            imagePath: nextTrackInfo.imagePath
        });
        setAutoPlayAfterSrcChange(true);

        // 현재 재생 중인 트랙을 업데이트합니다.
        setCurrentTrack(nextTrack);
    };

    const handlePreviousTrack = () => {
        if (!loginID) {
            // If loginID is not available, do nothing
            return;
        }
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
            trackId: previousTrackInfo.trackId,
            title: previousTrackInfo.title,
            writer: previousTrackInfo.writer,
            imagePath: previousTrackInfo.imagePath
        });

        setAutoPlayAfterSrcChange(true);
        // 현재 재생 중인 트랙을 업데이트합니다.
        setCurrentTrack(previousTrack);
    };

    const handleEnded = () => {
        handleNextTrack();
    };

    return (
        <div className={styles.container}>
            <Link to={`/detail/${track_info.trackId}`}>
                <div className={styles.imageContainer}>
                    <img
                        src={track_info.imagePath ? `/tracks/image/${track_info.imagePath}` : '/assets/groovy2.png'}
                        alt="Description of the image"
                        className={styles.image}
                    />
                </div>
            </Link>
            <AudioPlayer
                autoPlayAfterSrcChange={autoPlayAfterSrcChange}
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