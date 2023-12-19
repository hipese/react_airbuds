import React, { useContext, useEffect, useState } from "react";
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import styles from "./Mypage.module.css";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/system';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CheckIcon from '@mui/icons-material/Check';
import { Link, Route, Routes, useParams } from "react-router-dom";
import Mytracks from "./Mytracks/Mytracks";
import All from "./All/All";
import Myalbums from "./Myalbums/Myalbums";
import Myplaylists from "./Myplaylists/Myplaylists";
import { LoginContext } from "../../App";
import axios from "axios";
import PersonIcon from '@mui/icons-material/Person';

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

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

// function isDark(image) {
//     const canvas = document.createElement('canvas');
//     const context = canvas.getContext('2d');
    
//     // 캔버스 크기를 이미지 크기에 맞춥니다.
//     canvas.width = image.width;
//     canvas.height = image.height;
  
//     // 이미지를 캔버스에 그립니다.
//     context.drawImage(image, 0, 0, image.width, image.height);
  
//     // 이미지의 픽셀 데이터를 추출합니다.
//     const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
//     const data = imageData.data;
  
//     let r = 0, g = 0, b = 0;
  
//     // 픽셀별로 색상 값을 누적합니다.
//     for (let i = 0; i < data.length; i += 4) {
//       r += data[i];
//       g += data[i + 1];
//       b += data[i + 2];
//     }
  
//     // 평균 색상 값을 계산합니다.
//     r = Math.floor(r / (data.length / 4));
//     g = Math.floor(g / (data.length / 4));
//     b = Math.floor(b / (data.length / 4));
  
//     const hsp = Math.sqrt(
//         0.299 * (r * r) +
//         0.587 * (g * g) +
//         0.114 * (b * b)
//       );
//     return hsp < 127.5;
//   }

const MusicWithTabs = () => {

    const InputFileUpload = () => {
        return (
            <Button component="label" variant="contained" startIcon={<CloudUploadIcon />} onChange={changeBackgroundHandler}>
                Upload file
                <VisuallyHiddenInput type="file" />
            </Button>
        );
    }

    const { targetID } = useParams();
    const [value, setValue] = React.useState(0);
    const { loginID } = useContext(LoginContext);
    const [tracks, setTracks] = useState([]);
    const [profileImage, setProfileImage] = useState("");
    const [backgroundImage, setBackgroundImage] = useState("");
    const [newBackgroundImage, setNewBackgroundImage] = useState();
    const [backgroundState, setBackgroundState] = useState({backgroundColor : "whitesmoke"});
    const [isBackgroundChanged, setIsBackgroundChanged] = useState(false);
    const [isFollowed,setFollow] = useState(false);
    const [followNumber,setFollowNumber] = useState({});

    useEffect(() => {
        axios.get(`/api/track/findById/${targetID}`).then((resp) => {
            setTracks(resp.data);
        });

        // 프로필 이미지 + 배경 이미지 받아오기
        axios.get(`/api/member/getProfiles/${targetID}`).then((resp) => {
            console.log(resp.data);
            setProfileImage(resp.data.profile_image);
            setBackgroundImage(resp.data.background_image);
        }).catch(err => {
            console.log(err); // 나중에 오류 알림으로 바꾸기
        })

        checkFollowState();
        checkFollowNumber();
    }, [targetID]);

    const checkFollowState = () => {
        const formData = new FormData();
        formData.append("memberId",loginID);
        formData.append("singerId",targetID);

        axios.post(`/api/like/isfollow`,formData).then(res=>{
            setFollow(res.data);
        }).catch((e)=>{
            console.log(e);
        });
    }

    const checkFollowNumber = () => {
        axios.get(`/api/like/nums/${targetID}`).then(res=>{
            setFollowNumber(res.data);
        }).catch((e)=>{
            console.log(e);
        });
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        if(backgroundImage !== null && backgroundImage !== "")
            setBackgroundState({backgroundImage : `url(${backgroundImage})`, backgroundSize : "cover"});
        else 
            setBackgroundState({backgroundColor : "whitesmoke"});
    }, [backgroundImage]);

    const changeBackgroundHandler = (e) => {
        const newImagePath = URL.createObjectURL(e.target.files[0]);
        setNewBackgroundImage(e.target.files[0]);
        setBackgroundImage(newImagePath);
        setIsBackgroundChanged(true);
    };

    const uploadBackgroundHandler = () => {
        const formData = new FormData();
        formData.append( "newBgImage" ,newBackgroundImage);
        axios.post("/api/member/uploadBackground", formData, {headers : {"Content-Type" : "multipart/form-data"}})
        .then(resp => {
            console.log(resp);
            setIsBackgroundChanged(false);
        }).catch(err => {
            console.log(err);
        });

    };
    const handleFollowBtn = (state) => {
        if(loginID != ""){
            console.log(state);
            if(!state){
                const formData = new FormData();
                formData.append("memberId",loginID);
                formData.append("singerId",targetID)
                axios.post(`/api/like/follow`,formData).then(res=>{
                    checkFollowState();
                    checkFollowNumber();
                }).catch((e)=>{
                    console.log(e);
                });
            }else{
                const formData = new FormData();
                formData.append("memberId",loginID);
                formData.append("singerId",targetID)
                axios.post(`/api/like/followDelete`,formData).then(res=>{
                    checkFollowState();
                    checkFollowNumber();
                }).catch((e)=>{
                    console.log(e);
                });
            }
            
        }else{
            alert("로그인 필요");
            return;
        }
    }

    return (
        <Grid container>
            <Grid item className={styles.user_info} style={backgroundState}>
                <Grid item md={2}>
                    <Avatar alt="Remy Sharp" sx={{ width: 180, height: 180, marginLeft: 2 }} />
                </Grid>
                <Grid item md={7}>
                    <Typography variant="h2" gutterBottom>
                        {targetID}
                    </Typography>
                    <Typography variant="h5" gutterBottom>
                        &nbsp;'s Groovy Space
                    </Typography>
                </Grid>
                <Grid item md={3} style={{display : "flex", justifyContent:"center", alignItems : "center", flexDirection : "column"}}>
                    {
                        loginID !== null && targetID === loginID ?
                        <InputFileUpload />
                        :
                        <></>
                    }
                    {
                        isBackgroundChanged ?
                        <><br></br>
                            <Button component="label" variant="contained" startIcon={<CheckIcon />} onClick={uploadBackgroundHandler}>
                                SAVE
                            </Button>
                            </>
                             :
                            <></>
                    }
                    
                </Grid>
            </Grid>
            <Grid item xs={12} md={9} className={styles.Panel}>
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example"
                            TabIndicatorProps={{
                                style: { backgroundColor: '#4CAF50' }  // 선택된 탭의 라벨 밑에 있는 줄의 색상
                            }}
                        >
                            <Tab label="ALL" component={Link} to="" {...a11yProps(0)}
                                sx={{
                                    '&.Mui-selected': {
                                        color: '#4CAF50',  // 선택된 상태일 때의 라벨 색상
                                    },
                                }} />
                            <Tab label="Tracks" component={Link} to="tracks" {...a11yProps(1)} />
                            <Tab label="Albums" component={Link} to="albums" {...a11yProps(2)} />
                            <Tab label="Playlists" component={Link} to="playlists" {...a11yProps(3)} />
                            <div className={styles.like_edit}>
                                {!isFollowed ? <Button variant="outlined" startIcon={<PersonIcon/>}
                                    sx={{
                                        width: '100px',
                                        height: '30px',
                                        color: '#212529',
                                        borderColor: '#4CAF50',
                                        marginTop: '10px',
                                        marginBottom: '10px',
                                        marginRight: '10px',
                                        '&:hover': {
                                            borderColor: '#4CAF50',
                                            backgroundColor: '#4CAF50',
                                            color : "white"
                                        },
                                    }}
                                    onClick={()=>{handleFollowBtn(isFollowed)}}>
                                    Follow
                                </Button>
                                :
                                <Button variant="outlined" startIcon={<PersonIcon/>}
                                    sx={{
                                        width: '100px',
                                        height: '30px',
                                        color: 'white',
                                        borderColor: '#4CAF50',
                                        backgroundColor : '#4CAF50',
                                        marginTop: '10px',
                                        marginBottom: '10px',
                                        marginRight: '10px',
                                        '&:hover': {
                                            backgroundColor: 'white',
                                            borderColor: '#4CAF50',
                                            color: '#212529',
                                        },
                                    }}
                                    onClick={()=>{handleFollowBtn(isFollowed)}}>
                                    Follow
                                </Button>
                                }
                                
                                <Button variant="outlined" startIcon={<ModeEditIcon />}
                                    sx={{
                                        width: '100px',
                                        height: '30px',
                                        color: '#212529',
                                        borderColor: '#4CAF50',
                                        marginTop: '10px',
                                        marginBottom: '10px',
                                        '&:hover': {
                                            borderColor: '#4CAF50',
                                            backgroundColor: '#4CAF50',
                                        },
                                    }}>
                                    Edit
                                </Button>
                            </div>
                        </Tabs>
                    </Box>
                    {/* <CustomTabPanel value={value} index={0}>
                        <None_track_info />
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={1}>

                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={2}>
                        <None_track_info />
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={3}>
                        <None_track_info />
                    </CustomTabPanel> */}
                    <Routes>
                        <Route path="/" element={<All />} />
                        <Route path="/tracks" element={<Mytracks />} />
                        <Route path="/albums" element={<Myalbums />} />
                        <Route path="/playlists" element={<Myplaylists />} />
                    </Routes>
                </Box>
            </Grid>
            <Grid item xs={12} md={3}>
                <div className={styles.followersInfo}>
                    <div className={styles.infoItem}>
                        <Typography variant="h6" gutterBottom>
                            Followers<br></br>
                            {followNumber.followers}
                        </Typography>
                    </div>
                    <div className={styles.infoItem}>
                        <Typography variant="h6" gutterBottom>
                            Following<br></br>
                            {followNumber.followings}
                        </Typography>
                    </div>
                    <div className={styles.infoItemLast}>
                        <Typography variant="h6" gutterBottom>
                            Tracks<br></br>
                            {tracks.length}
                        </Typography>
                    </div>
                </div>
                <div className={styles.myreply}>
                    나의 최근 댓글
                </div>
            </Grid>
        </Grid>
    );
}

export default MusicWithTabs;
