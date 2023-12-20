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
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

import style from "./report.module.css";
import Swal from "sweetalert2";
import "@sweetalert2/themes/bootstrap-4";

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
    const [isFavorite, setFavorite] = useState(0);
    const [replyLike, setReplyLike] = useState([]);
    const [likeCount, setLikeCount] = useState([]);

    const loadingReplies = async () => {
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
    }

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

    const loadingLikes = async () => {
        axios.get(`/api/tllike/${loginID}`).then(res => {
            setReplyLike(res.data);
        }).catch((e) => {
            console.log(e);
        });
    }

    useEffect(() => {
        loadingLikes();
        loadingReplies();
    }, [isFavorite, loginID]);

    const handleFavorite = (replySeq, isLiked, e) => {
        if (loginID !== "") {
            if (!isLiked) {
                const formData = new FormData();
                formData.append("seq", 0);
                formData.append("id", loginID);
                formData.append("replySeq", replySeq);
                axios.post(`/api/tllike`, formData).then(res => {
                    setReplyLike([...replyLike, { replySeq: replySeq, id: loginID, seq: res.data }]);
                    setFavorite(isFavorite + 1);
                }).catch((e) => {
                    console.log(e);
                });
            } else {
                const deleteData = new FormData();
                deleteData.append("replySeq", replySeq);
                deleteData.append("id", loginID);
                axios.post(`/api/tllike/delete`, deleteData).then(res => {
                    const newLikeList = replyLike.filter(e => e.replySeq !== replySeq);
                    setReplyLike(newLikeList);
                    setFavorite(isFavorite + 1);
                }).catch((e) => {
                    console.log(e);
                });
            }
        } else {
            alert("좋아요는 로그인을 해야 합니다.")
            return;
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();

        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        const diffInHours = Math.floor(diffInMinutes / 60);

        if (diffInMinutes < 1) {
            return '방금 전';
        } else if (diffInHours < 1) {
            return `${diffInMinutes}분 전`;
        } else if (diffInHours < 24) {
            return `${diffInHours}시간 전`;
        } else {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return date.toLocaleDateString('ko-KR', options);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // 엔터키 기본 동작 막기 (개행 추가 방지)
            handlePostReply(); // 댓글 작성 함수 호출
        }
    };


    const [boxChecked, setBoxChecked] = useState();

    const handleReport = async () => {

        const { value: formValues } = await Swal.fire({
            title: "신고",
            html: `
          <hr>
          <p>신고하실 내용이 무엇입니까?</p>
          <p id="track" style="text-decoration: underline;">
            트랙을 신고
            <input type="checkbox" id="trackCheckbox" checked style="cursor: pointer;" >
          </p>
          <p id="coverImage" style="cursor: pointer; text-decoration: underline;" >
          커버 이미지를 신고
          <input type="checkbox" id="coverImageCheckbox" style="cursor: pointer;" >
          </p>
          <input  type="text" id="reason" placeholder="신고 사유" class="swal2-input" />
          <p id="contents">
            ex) 저작권침해, 사칭, 남용, 상표권침해, 그 외 사유
          </p>
          <hr>
          <p>
            보고된 신고는 관리자에 의해 검토되며, 관리자는 신고 내용이 당사의
            지침 또는 약관을 위반할 경우 조치를 취합니다.
          </p>
          <p>반복적인 위반이나 심각한 위반은 계정을 영구적으로 삭제 할 수 있습니다.</p>
          `,
            confirmButtonText: "신고완료",
            focusConfirm: false,
            customClass: {
                container: style.htmlContainer,
                popup: style.swal2PopUpHeWid,
                title: style.title,
                htmlContainer: style.text,
                confirmButton: style.confirm,
                cancelButton: style.cancel,
            },
            didOpen: () => {
                const trackCheckbox = document.getElementById("trackCheckbox");
                const coverImageCheckbox = document.getElementById("coverImageCheckbox");

                trackCheckbox.addEventListener("change", () => {
                    setBoxChecked("Track");
                });

                coverImageCheckbox.addEventListener("change", () => {
                    setBoxChecked("CoverImage");
                });
            },
            preConfirm: async () => {
                const trackCheckbox = document.getElementById("trackCheckbox");
                const coverImageCheckbox = document.getElementById("coverImageCheckbox");
                const reasonInput = document.getElementById("reason");

                if (reasonInput.value === "") {
                    Swal.showValidationMessage("신고 사유를 입력해주세요");
                } else {

                    if (!trackCheckbox.checked && !coverImageCheckbox.checked) {
                        // 사용자가 체크박스를 선택하지 않은 경우 예외 처리
                        Swal.showValidationMessage("적어도 하나의 항목을 선택하세요.");
                    } else {
                        if (trackCheckbox.checked && coverImageCheckbox.checked) {
                            // 사용자가 체크박스를 둘 다 선택한 경우 예외 처리
                            Swal.showValidationMessage("둘 중 하나의 항목 만을 선택하세요.");
                        } else {
                            // FormData 생성
                            const formData = new FormData();
                            formData.append("reason", reasonInput.value);
                            formData.append("trackId", trackId);
                            formData.append("ReportWriter", loginID);
                            formData.append("ReportCategory", trackCheckbox.checked ? "Track" : "CoverImage");
                            formData.append("ReportSubject", track.writeId);

                            try {
                                // 서버로 데이터 전송
                                const response = await axios.post("/api/report", formData, {
                                    headers: {
                                        "Content-Type": "multipart/form-data",
                                    },
                                });
                            } catch (error) {
                                console.error("Error sending data to server:", error);
                            }
                        }
                    }
                }
            },
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
                        <div onClick={handleReport} className={style.report}>
                            <ErrorOutlineIcon />&nbsp;&nbsp;신고
                        </div>
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
                                    {track.writeId}
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
                                        onChange={handleReplyChange}
                                        onKeyDown={handleKeyDown}
                                    />
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
                                    <div className={styles.reply_info}>
                                        <Typography variant="h6">{comment.writer}</Typography>
                                        <Typography variant="body1">{comment.contents}</Typography>
                                        <Typography variant="caption">{formatDate(comment.writeDate)}</Typography>
                                    </div>
                                )}
                                <div className={styles.udContainer}>
                                    <div className={styles.thumbUp}>
                                        <div className={styles.thumbUp}
                                            onClick={(e) => { handleFavorite(comment.seq, replyLike.some(replyLike => replyLike.replySeq === comment.seq), e) }}>
                                            {replyLike.some(replyLike => replyLike.replySeq === comment.seq) ? <ThumbUpIcon /> : <ThumbUpOffAltIcon />}
                                            <div className={styles.count}>{comment.likeCount}</div>
                                        </div>
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
