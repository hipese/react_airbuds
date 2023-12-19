import { Avatar, Button, Grid, Menu, MenuItem, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import styles from './Track_Detail.module.css';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RepeatIcon from '@mui/icons-material/Repeat';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import { AutoPlayContext, CurrentTrackContext, LoginContext, MusicContext, PlayingContext, TrackContext, TrackInfoContext } from '../../../App';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Pagination, PaginationItem } from "@mui/material";

const theme = createTheme({
    components: {
        MuiMenu: {
            styleOverrides: {
                paper: {
                    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', // 원하는 그림자 스타일로 변경
                },
            },
        },
    },
});

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
    const [reply, setReply] = useState({ trackId: trackId, writer: "", contents: "", writeDate: "" });
    const [replyList, setReplyList] = useState([]);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const [selectedSeq, setSelectedSeq] = useState(null);
    const [editMode, setEditMode] = useState(null);
    const [editedReply, setEditedReply] = useState({ trackId: trackId, writer: "", contents: "", writeDate: "" });
    const COUNT_PER_PAGE = 10;
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        axios.get(`/api/track/bytrack_id/${trackId}`).then(resp => {
            const track = resp.data;
            const imagePath = track.trackImages.length > 0 ? track.trackImages[0].imagePath : null;
            const trackWithImage = { ...track, imagePath };
            setTrack(trackWithImage);
        });

        axios.get(`/api/reply/${trackId}`).then(resp => {
            setReplyList(resp.data);
        }).catch((e) => {
            console.log(e);
        });
    }, [loginID]);

    const totalItems = replyList.length;
    const totalPages = Math.ceil(totalItems / COUNT_PER_PAGE);

    const onPageChange = (e, page) => {
        setCurrentPage(page);
    };

    const startIndex = (currentPage - 1) * COUNT_PER_PAGE;
    const endIndex = Math.min(startIndex + COUNT_PER_PAGE, totalItems);
    const visibleSignList = replyList.slice(startIndex, endIndex);

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

    const handleReplyChange = (e) => {
        const value = e.target.value;
        setReply(prev => ({ ...prev, contents: value, writer: loginID, }));
    }

    const handlePostReply = () => {
        axios.post(`/api/reply`, reply).then(resp => {
            console.log(resp.data);
            // setReplyList(prev => ([...prev, reply]))
            setReply((prev) => ({ ...prev, contents: "" }));
            axios.get(`/api/reply/${trackId}`).then(resp => {
                setReplyList(resp.data);
            }).catch((e) => {
                console.log(e);
            });
        }).catch((e) => {
            console.log(e);
        });
    }

    const handleClick = (event, seq) => {
        setAnchorEl(event.currentTarget);
        setSelectedSeq(seq);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDeleteClick = (comment) => {
        console.log(comment.seq);
        // 삭제 버튼 클릭 시 확인 메시지 표시
        const shouldDelete = window.confirm('정말로 삭제하시겠습니까?');
        // 삭제 버튼 클릭 시 해당 댓글 삭제
        if (shouldDelete) {
            axios.delete(`/api/reply/${comment.seq}`).then(resp => {
                // 삭제 후 댓글 목록 다시 가져오기
                axios.get(`/api/reply/${trackId}`).then(resp => {
                    setReplyList(resp.data);
                }).catch((e) => {
                    console.log(e);
                });
            }).catch((e) => {
                console.log(e);
            });
        }
        handleClose();
    }

    const handleEditClick = (seq, currentReply) => {
        console.log(seq);
        setEditMode(seq);
        setEditedReply(currentReply); // 편집을 위한 초기값 설정
        handleClose();
    };

    const handleCancelEdit = () => {
        setEditMode(null); // Exit edit mode
    };

    const changeEditedData = (e) => {
        const value = e.target.value;
        setEditedReply(prev => ({ ...prev, contents: value, writer: loginID, }));
    };

    const handleUpdateClick = (seq) => {
        axios.put(`/api/reply/${seq}`, editedReply)
            .then(resp => {
                // 성공적인 업데이트 처리
                setEditMode(null);
                axios.get(`/api/reply/${trackId}`).then(resp => {
                    setReplyList(resp.data);
                }).catch((e) => {
                    console.log(e);
                });
            })
            .catch((e) => {
                console.log(e);
            });
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
                                height="300px"
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
                        <Grid item className={styles.flexContainer2}>
                            <Grid item className={styles.title_writer}>
                                <Grid item className={styles.track_title}>
                                    <Typography variant="h3">제목: {track.title}</Typography>
                                </Grid>
                                <Grid item className={styles.track_writer}>
                                    <Typography variant="h5">가수: {track.writer}</Typography>
                                </Grid>
                            </Grid>
                            <Grid item className={styles.play_button}
                                onClick={() => addTrackToPlaylist(track)} // div를 클릭할 때마다 호출됨
                            >
                                <PlayCircleIcon sx={{ width: '200px', height: '200px' }} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <br></br>
                <Grid container>
                    <Grid item className={styles.innerContainer2}>
                        <Grid item xs={12} md={12} container className={styles.profileContainer}>
                            <Grid item xs={12} md={12} className={styles.user_info}>
                                <Avatar alt="Profile" src="/static/images/avatar/1.jpg" sx={{ width: '80px', height: '80px' }} />
                                <Typography variant="body1">
                                    {loginID ? loginID : '로그인해주세요'}
                                </Typography>
                                <div className={styles.like}>
                                    <FavoriteBorderIcon />
                                    <Typography variant="body1">16.9K</Typography>
                                    <RepeatIcon />
                                    <Typography variant="body1">368</Typography>
                                    <FormatAlignLeftIcon />
                                    <Typography variant="body1">5</Typography>
                                </div>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={12} className={styles.reply_container}>
                        {/* <Typography variant="h6" className="mt-4">9 comments</Typography> */}
                        <Grid item className="mt-2">
                            <Grid container className="mt-2">
                                <Grid item xs={12} md={12} className={styles.reply_input}>
                                    <TextField
                                        label="댓글을 입력하세요"
                                        variant="outlined"
                                        fullWidth
                                        multiline
                                        rows={1}
                                        value={reply.contents}
                                        onChange={handleReplyChange} />
                                    <Button variant="contained" onClick={handlePostReply} sx={{
                                        height: '56px',
                                        width: '100px',
                                        color: '#FFFFFF',
                                        borderColor: '#000000',
                                        backgroundColor: '#1e1e1e',
                                        marginTop: '10px',
                                        marginBottom: '10px',
                                        '&:hover': {
                                            borderColor: '#4CAF50',
                                            backgroundColor: '#4CAF50',
                                        },
                                        marginLeft: '10px',

                                    }}>
                                        작성하기
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item className={styles.replyoutput}>
                        {visibleSignList.map((comment, index) => (
                            <Grid item key={index} className={styles.commentContainer}>
                                {editMode === comment.seq ? ( // Show input field in edit mode
                                    <Grid item xs={12} md={12} className={styles.editContainer}>
                                        <TextField
                                            name='contents'
                                            fullWidth
                                            multiline
                                            rows={1}
                                            value={editedReply.contents}
                                            onChange={changeEditedData}
                                            size="small"
                                            sx={{ width: '70%' }}
                                        />
                                        <Button
                                            variant="contained"
                                            onClick={() => handleUpdateClick(comment.seq)}
                                            sx={{
                                                color: '#FFFFFF',
                                                borderColor: '#000000',
                                                backgroundColor: '#1e1e1e',
                                                marginTop: '10px',
                                                marginBottom: '10px',
                                                '&:hover': {
                                                    borderColor: '#4CAF50',
                                                    backgroundColor: '#4CAF50',
                                                },
                                                marginLeft: '10px',
                                            }}
                                        >
                                            확인
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            onClick={() => handleCancelEdit()}
                                            sx={{
                                                color: '#000000',
                                                borderColor: '#000000',
                                                marginTop: '10px',
                                                marginBottom: '10px',
                                                '&:hover': {
                                                    borderColor: '#4CAF50',
                                                },
                                                marginLeft: '10px',
                                            }}
                                        >
                                            취소
                                        </Button>
                                    </Grid>
                                ) : (
                                    // Display text in view mode
                                    <div className={styles.reply_info}>
                                        <Typography variant="h6">{comment.writer}</Typography>
                                        <Typography variant="body1">{comment.contents}</Typography>
                                        <Typography variant="caption">{comment.writeDate}</Typography>
                                    </div>
                                )}
                                <div className={styles.udContainer}>
                                    <div className={styles.thumbUp}>
                                        <ThumbUpOffAltIcon />
                                        <div className={styles.count}>3.2k</div>
                                    </div>
                                    <Button
                                        sx={{
                                            width: '10px',
                                            color: '#000000',
                                            borderColor: '#000000',
                                        }}
                                        id="basic-button"
                                        aria-controls={open ? 'basic-menu' : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={open ? 'true' : undefined}
                                        onClick={(event) => handleClick(event, comment)}
                                    >
                                        ⋮
                                    </Button>
                                    <ThemeProvider theme={theme}>
                                        <Menu
                                            id={`basic-menu-${comment}`}
                                            anchorEl={anchorEl}
                                            open={open && selectedSeq === comment}
                                            onClose={handleClose}
                                            MenuListProps={{
                                                'aria-labelledby': `basic-button-${comment}`,
                                            }}
                                        >
                                            {comment.writer === loginID && (
                                                [
                                                    <MenuItem key="delete" onClick={() => handleDeleteClick(comment)}>
                                                        <DeleteOutlineIcon />&nbsp;&nbsp;삭제
                                                    </MenuItem>,
                                                    <MenuItem key="edit" onClick={() => handleEditClick(comment.seq, comment)}>
                                                        <EditIcon />&nbsp;&nbsp;수정
                                                    </MenuItem>,
                                                ]
                                            )}
                                            <MenuItem onClick={() => handleClose(comment)}>
                                                <ErrorOutlineIcon />&nbsp;&nbsp;신고
                                            </MenuItem>
                                        </Menu>
                                    </ThemeProvider>
                                </div>
                            </Grid>
                        ))}
                    </Grid>
                    <Grid item xs={12} md={12} className={styles.pageNation}>
                        <Pagination
                            count={totalPages}
                            page={currentPage}
                            onChange={onPageChange}
                            size="medium"
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                padding: "15px 0",
                            }}
                            renderItem={(item) => (
                                <PaginationItem {...item} sx={{ fontSize: 12 }} />
                            )}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Grid >
    );
};

export default Track_Detail;
