import React from "react";
import { Avatar, Button, Skeleton, Typography } from "@mui/material";
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import styles from "./NoTrackInfo.module.css";

import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import { useNavigate } from "react-router";



const NoTrackInfo = ({text}) => {

    const navigator=useNavigate();

    const handleAddAlbum = () => {
        navigator("/Upload");
    }
    return (
        <div>
            <div className={styles.plsupload}>
                <Typography variant="h5" gutterBottom>
                    {text}이 존재하지 않습니다.<br></br>
                </Typography>
            </div>
            <div className={styles.plsupload}>
                <Typography variant="subtitle1" gutterBottom>
                    아래 버튼을 통해 업로드를 통해 {text}을 제작해주세요<br /><br /><br />

                    <Button className={styles.button} onClick={handleAddAlbum}>
                        <PlaylistAddIcon />
                        {text} 생성하기
                    </Button>


                </Typography>
            </div>
        </div>
    );
}

export default NoTrackInfo;