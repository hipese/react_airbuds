import React from "react";
import { Avatar, Button, Skeleton, Typography } from "@mui/material";
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import styles from "./None_login_info.module.css";
import { Link } from "react-router-dom";

const None_track_info = () => {
    return (
        <div>
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
                    🎶 Groovy에 회원이 되어주세요! 🎵<br></br>
                </Typography>
            </div><div className={styles.plsupload}>
                <Typography variant="subtitle1" gutterBottom>
                    좋은 음악과 다양한 기능을 경험해보세요.<br/><br/><br/>
                    <Link to="/Register">
                        <Button component="label" variant="contained" startIcon={<LibraryMusicIcon />}>
                            회원가입 하러 가기
                        </Button>
                    </Link>
                </Typography>
            </div>
        </div>
    );
}

export default None_track_info;