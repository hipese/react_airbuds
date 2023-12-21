import React from "react";
import { Avatar, Button, Skeleton, Typography } from "@mui/material";
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import styles from "./None_overview_info.module.css";
import { Link } from "react-router-dom";

const None_overview_info = () => {
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
                    🎶 Groovy에 오신것을 환영합니다.! 🎵<br></br>
                </Typography>
            </div><div className={styles.plsupload}>
                <Typography variant="subtitle1" gutterBottom>
                    Groovy의 음악 공간에 여러분의 음악을 추가해보세요.<br></br>
                    노래, 앨범, 혹은 특별한 플레이리스트를 올려주시면,<br></br>
                    여러분의 음악을 팬들과 공유할 수 있습니다.<br></br><br></br><br></br>
                    <Link to="/Upload">
                        <Button
                            component="label"
                            variant="contained"
                            startIcon={<LibraryMusicIcon />}
                            sx={{
                                backgroundColor: '#4CAF50', // Default background color
                                color: 'white', // Default text color
                                '&:hover': {
                                    backgroundColor: '#45a049', // Change background color on hover
                                },
                            }}
                        >
                            Upload Music
                        </Button>
                    </Link>
                </Typography>
            </div>
        </>
    );
}

export default None_overview_info;