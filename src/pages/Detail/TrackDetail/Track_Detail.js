import { Avatar } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import styles from './Track_Detail.module.css';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RepeatIcon from '@mui/icons-material/Repeat';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';


const Track_Detail = () => {
    const { trackId } = useParams();
    const [track, setTrack] = useState({});

    useEffect(() => {
        axios.get(`/api/track/bytrack_id/${trackId}`).then(resp => {
            setTrack(resp.data);
        });
    }, []);


    return (
        <div>
            <div className={styles.flexContainer}>
                <div className={styles.innerContainer}>
                    <div className={styles.profileImage}>
                        <Avatar alt="Profile" src="/static/images/avatar/1.jpg" sx={{ width: '100%', height: '100%' }} />
                    </div>
                    <div>
                        <h1>{track.writer} - {track.title}</h1>
                        <p>Album Name</p>
                    </div>
                </div>
                <div>
                    <p>2 months ago</p>
                </div>
            </div>
            <div className="relative">
                {track.trackImages && track.trackImages.length > 0 && (
                    <img
                        alt=""
                        className="w-full h-48"
                        height="200"
                        src={`/tracks/image/${track.trackImages[0].imagePath}`}
                        style={{
                            aspectRatio: "1792/200",
                            objectFit: "cover",
                        }}
                        width="1792"
                    />
                )}
                <div className={styles.absoluteBottomLeft}>

                </div>
            </div>
            <div className={styles.innerContainer2}>
                <div className={styles.profileContainer}>
                    <div className={styles.profileImage}>
                        <Avatar alt="Profile" src="/static/images/avatar/1.jpg" sx={{ width: '100%', height: '100%' }} />
                    </div>
                    <div>
                        <p>User Name</p>
                        <p>I just wanna talk to you 10N1</p>
                        <p>#tag1 #tag2 #tag3</p>
                    </div>
                </div>
                <div className={styles.flexItemsCenterSpaceX2}>
                    <FavoriteBorderIcon />
                    <p>16.9K</p>
                    <RepeatIcon />
                    <p>368</p>
                    <FormatAlignLeftIcon />
                    <p>5</p>
                </div>
            </div>
            <div className="px-4 pb-4">
                <div className="mt-4">
                    <p className="text-sm font-bold">9 comments</p>
                    <div className="mt-2">
                        <div className="flex items-start space-x-2">

                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold">Username</p>
                                <p className="text-xs text-gray-400">Comment text here</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};


export default Track_Detail;
