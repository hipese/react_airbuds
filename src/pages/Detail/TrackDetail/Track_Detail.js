import { Avatar, Grid, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import styles from './Track_Detail.module.css';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RepeatIcon from '@mui/icons-material/Repeat';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import { AutoPlayContext, CurrentTrackContext, LoginContext, MusicContext, PlayingContext, TrackContext, TrackInfoContext } from '../../../App';
import { Button } from 'reactstrap';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';

const Track_Detail = () => {
    const { trackId } = useParams();
    const [track, setTrack] = useState({});
    const { loginID, setLoginID } = useContext(LoginContext);
    const { audioFiles, setAudioFiles } = useContext(MusicContext);
    const { isPlaying, setIsPlaying } = useContext(PlayingContext);
    const { currentTrack, setCurrentTrack } = useContext(CurrentTrackContext);
    const { track_info, setTrack_info } = useContext(TrackInfoContext);
    const { tracks, setTracks } = useContext(TrackContext);
    const { autoPlayAfterSrcChange, setAutoPlayAfterSrcChange } = useContext(AutoPlayContext);

    useEffect(() => {
        axios.get(`/api/track/bytrack_id/${trackId}`).then(resp => {
            const track = resp.data;
            const imagePath = track.trackImages.length > 0 ? track.trackImages[0].imagePath : null;
            const trackWithImage = { ...track, imagePath };
            setTrack(trackWithImage);
        });
    }, []);

    // 특정 트랙을 재생 목록에 추가하는 함수
    const addTrackToPlaylist = (track) => {

        axios.post(`/api/cplist`, {
            trackId: track.trackId,
            id: loginID
        }).then(resp => {

        })

        setAutoPlayAfterSrcChange(true);

        // 트랙에서 관련 정보 추출
        const { filePath, imagePath, title, writer } = track;
        console.log(imagePath);
        // TrackInfoContext를 선택한 트랙 정보로 업데이트
        setTrack_info({
            filePath,
            imagePath,
            title,
            writer,
        });

        setTracks((prevTracks) => [track, ...prevTracks]);

        // 현재 트랙을 중지하고 새 트랙을 재생 목록에 추가하고 재생 시작
        setAudioFiles((prevAudioFiles) => [`/tracks/${filePath}`, ...prevAudioFiles]);
        setCurrentTrack(0);
        setIsPlaying(true);
    };

    return (
        <Grid container className={styles.container}>
            <Grid item xs={12} md={8} className={styles.container2}>
                <Grid container className={styles.flexContainer}>
                    <Grid item xs={12} md={11} className={styles.innerContainer}>
                        <Typography variant="h4">음원 정보</Typography>
                    </Grid>
                    <Grid item xs={12} md={1}>
                        <Typography variant="subtitle2">2 months ago</Typography>
                    </Grid>
                </Grid>
                <Grid container className={styles.track_info}>
                    <Grid item xs={12} md={4} className={styles.track_image}>
                        {track.trackImages && track.trackImages.length > 0 && (
                            <img
                                alt=""
                                className="w-full h-48"
                                height="300"
                                src={`/tracks/image/${track.imagePath}`}
                                style={{
                                    aspectRatio: "9/7",
                                    objectFit: "cover",
                                }}
                                width="100%"
                            />
                        )}
                    </Grid>
                    <Grid item xs={12} md={8} className={styles.track_title_writer}>
                        <div>
                            <div className={styles.track_title}>
                                <Typography variant="h5">제목: {track.title}</Typography>
                            </div>
                            <div className={styles.track_writer}>
                                <Typography variant="h5">가수: {track.writer}</Typography>
                            </div>
                        </div>
                        <div className={styles.play_button}
                            onClick={() => addTrackToPlaylist(track)} // div를 클릭할 때마다 호출됨
                        >
                            <PlayCircleIcon sx={{ width: '40px', height: '40px' }} />
                        </div>
                    </Grid>
                </Grid>
                <Grid container className={styles.innerContainer2}>
                    <Grid item xs={12} md={12} container className={styles.profileContainer}>
                        <Grid item xs={12} md={12} className={styles.profileImage}>
                        </Grid>
                        <Grid item xs={12} md={10} className={styles.user_info}>
                            <Avatar alt="Profile" src="/static/images/avatar/1.jpg" sx={{ width: '80px', height: '80px' }} />
                            <Typography variant="body1">{loginID}</Typography>
                        </Grid>
                        <Grid item xs={12} md={2} className={styles.flexItemsCenterSpaceX2}>
                            <FavoriteBorderIcon />
                            <Typography variant="body1">16.9K</Typography>
                            <RepeatIcon />
                            <Typography variant="body1">368</Typography>
                            <FormatAlignLeftIcon />
                            <Typography variant="body1">5</Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} md={12} className={styles.reply_container}>
                    <Typography variant="h6" className="mt-4">9 comments</Typography>
                    <Grid item className="mt-2">
                        <Grid container className="mt-2">
                            <Grid item xs={1}></Grid>
                            <Grid item xs={9}>
                                <TextField
                                    label="댓글을 입력하세요"
                                    variant="outlined"
                                    fullWidth
                                    multiline
                                    rows={1}
                                />
                            </Grid>
                            <Grid item xs={2} className="flex items-end">
                                <Button variant="contained" color="primary">
                                    댓글 작성
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Track_Detail;
