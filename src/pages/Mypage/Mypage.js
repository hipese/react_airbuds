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

const MusicWithTabs = () => {
    const { loginId } = useParams();
    const [value, setValue] = React.useState(0);
    const { loginID, setLoginID } = useContext(LoginContext);
    const [tracks, setTracks] = useState([]);
    const [isFollowed,setFollow] = useState(false);
    const [followNumber,setFollowNumber] = useState({});

    useEffect(()=>{
        checkTrackNumber();
        checkFollowState();
        checkFollowNumber();
    },[loginId]);

    useEffect(() => {
        if (!loginID) {
            return;
        }

        checkTrackNumber();
        checkFollowState();
        checkFollowNumber();
    }, [loginID]);

    const checkTrackNumber = () => {
        axios.get(`/api/track/findById/${loginId}`).then((resp) => {
            setTracks(resp.data);
        });
    }

    const checkFollowState = () => {
        const formData = new FormData();
        formData.append("memberId",loginID);
        formData.append("singerId",loginId);

        axios.post(`/api/like/isfollow`,formData).then(res=>{
            setFollow(res.data);
        }).catch((e)=>{
            console.log(e);
        });
    }

    const checkFollowNumber = () => {
        axios.get(`/api/like/nums/${loginId}`).then(res=>{
            setFollowNumber(res.data);
        }).catch((e)=>{
            console.log(e);
        });
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleFollowBtn = (state) => {
        if(loginID != ""){
            console.log(state);
            if(!state){
                const formData = new FormData();
                formData.append("memberId",loginID);
                formData.append("singerId",loginId)
                axios.post(`/api/like/follow`,formData).then(res=>{
                    checkFollowState();
                    checkFollowNumber();
                }).catch((e)=>{
                    console.log(e);
                });
            }else{
                const formData = new FormData();
                formData.append("memberId",loginID);
                formData.append("singerId",loginId)
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
            <Grid item className={styles.user_info}>
                <Grid item md={2}>
                    <Avatar alt="Remy Sharp" sx={{ width: 180, height: 180, marginLeft: 2 }} />
                </Grid>
                <Grid item md={7}>
                    <Typography variant="h2" gutterBottom>
                        {loginId}
                    </Typography>
                    <Typography variant="h5" gutterBottom>
                        &nbsp;'s Groovy Space
                    </Typography>
                </Grid>
                <Grid item md={3}>
                    <InputFileUpload />
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
                                {
                                    loginID == loginId ?
                                    ""
                                    :
                                    !isFollowed ?
                                    //팔로우 안한 상태일때.
                                    <Button variant="outlined" startIcon={<PersonIcon/>}
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
                                //팔로우 한 상태일때.
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
                            {followNumber.followers ? followNumber.followers : "0"}
                        </Typography>
                    </div>
                    <div className={styles.infoItem}>
                        <Typography variant="h6" gutterBottom>
                            Following<br></br>
                            {followNumber.followings ? followNumber.followings : "0"}
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

const InputFileUpload = () => {
    return (
        <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
            Upload file
            <VisuallyHiddenInput type="file" />
        </Button>
    );
}

export default MusicWithTabs;
