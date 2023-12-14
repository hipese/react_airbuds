// WaveSurferPlayer.js

import React, { useRef, useEffect, useState, } from 'react';
import WaveSurfer from 'wavesurfer.js';
import styles from "./WaveSurferPlayer.module.css";

const WaveSurferPlayer = ({ url, height, width, initialZoom, isPlaying }) => {
    const containerRef = useRef();
    const [wavesurfer, setWavesurfer] = useState(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const ws = WaveSurfer.create({
            container: containerRef.current,
            waveColor: '#4CAF50',        // 주 파형 색상 (초록색)
            progressColor: '#616161',    // 진행중 파형 색상 (회색)
            height: height || 100,
            width: width || 700,
            pixelRatio: 1,
            minPxPerSec: initialZoom || 50,
            barWidth: 1,  // 파형의 두께 조절
            hideScrollbar: true
        });

        setWavesurfer(ws);

        return () => {
            ws.destroy();
        };
    }, [height, width]);

    const togglePlay = () => {
        if (wavesurfer) {
            
            wavesurfer.playPause();
            console.log("실행됨");
        }
    };

    useEffect(() => {
        if (!wavesurfer) return;

        wavesurfer.load(url);

        console.log(isPlaying);

        if (isPlaying) {
            togglePlay();
        } else {
            wavesurfer.pause();
            console.log("멈춤");
        }

        wavesurfer.on('audioprocess', (currentTime) => {
            //console.log('Current Time:', currentTime);
        });

    }, [wavesurfer, url, isPlaying]);



    return (
        <div className={styles.container}>
            <div ref={containerRef} />
            <button onClick={togglePlay}>들어보기</button>
        </div>
    );
};

export default WaveSurferPlayer;
