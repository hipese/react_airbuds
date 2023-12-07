import React from "react";
import { Avatar, Button, Skeleton, Typography } from "@mui/material";
import { styled } from '@mui/system';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import styles from "./None_track_info.module.css";

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const None_track_info = () => {
    return (
        <>
            <div className={styles.none_track}>
                <Skeleton variant="circular">
                    <Avatar />
                </Skeleton>
                <Skeleton animation="wave" height={60} width={'30%'} />
            </div><div className={styles.none_track}>
                <Skeleton variant="circular">
                    <Avatar />
                </Skeleton>
                <Skeleton animation="wave" height={60} width={'30%'} />
            </div><div className={styles.none_track}>
                <Skeleton variant="circular">
                    <Avatar />
                </Skeleton>
                <Skeleton animation="wave" height={60} width={'30%'} />
            </div><div className={styles.plsupload}>
                <Typography variant="h5" gutterBottom>
                    🎶 음원을 공유해보세요! 🎵<br></br>
                </Typography>
            </div><div className={styles.plsupload}>
                <Typography variant="subtitle1" gutterBottom>
                    Groovy의 음악 공간에 여러분의 음악을 추가해보세요.<br></br>
                    노래, 앨범, 혹은 특별한 플레이리스트를 올려주시면,<br></br>
                    여러분의 음악을 팬들과 공유할 수 있습니다.<br></br><br></br><br></br>
                    <Button component="label" variant="contained" startIcon={<LibraryMusicIcon />}>
                        Upload Music
                        <VisuallyHiddenInput type="file" />
                    </Button>
                </Typography>
            </div>
        </>
    );
}

export default None_track_info;