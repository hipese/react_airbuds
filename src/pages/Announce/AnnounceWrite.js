import { Button, Grid, MenuItem, Select, TextField, Typography } from '@mui/material';
import style from './announce.module.css'
import Reactquill from './ReactQuill';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { LoginContext, RoleContext } from '../../App';
const AnnounceWriteMain = () =>{

    const {loginID} = useContext(LoginContext);
    const [announce, setAnnounce] = useState({announceTitle:"",announceWriter:loginID, announceCategory:"none",announcePublic:1, announceContents:"",announceAnswerState:0,announceWriteDate:new Date().toISOString(),files:[]});

    const {userRole} = useContext(RoleContext);
    
    //페이지 접근제한 구현
    useEffect(()=>{
        console.log(userRole);
        if(userRole !== null || userRole !== undefined){
            if(userRole == "ROLE_MEMBER"){
                alert("잘못된 접근입니다.");
                navi("/");
            }else if(userRole == "ROLE_MANAGER"){
                
            }
        }
    },[userRole]);

    const navi = useNavigate();
    const handleChange = (e) => {
        const {name,value} = e.target;
        console.log(name, value);
        setAnnounce(prev=>({...prev,[name]:value}));
    }
    const handleSubmit = () => {        
        if(announce.announceTitle == ""){
            alert("제목을 작성해주세요.");
            return;
        }

        if(announce.announceCategory == "none"){
            alert("카테고리를 선택해주세요.");
            return;
        }

        if(announce.announceContents == ""){
            alert("공지할 내용을 작성해주세요.");
            return;
        }

        if(announce.announceCategory == "none"){
            alert("카테고리를 선택해주세요.");
            return;
        }
        axios.post("/api/announce",announce).then(res=>{
            navi("/announce");
        }).catch((e)=>{
            console.log(e);
        });
    }

    const handleCancel = () => {
        navi(-1);
    }
    return(
        <div className={`${style.wrap}`}>
            <div className={`${style.announceWrite} ${style.ma} `}>
                <div className={`${style.marginT70}`}>
                    <Typography className={`${style.pad10}`} fontSize={26} fontWeight={'bold'}>
                        공지사항 작성
                    </Typography>
                    <div className={`${style.announceTitle} ${style.borderWrite}`}>
                        <Grid container className={`${style.pl10} ${style.center}`} spacing={1}>
                            <Grid item xs={12}>
                                <Typography fontSize={18} fontWeight="bold">
                                    제목
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography fontSize={12}>
                                    
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="공지 제목"
                                    id="outlined-size-small"
                                    size="small"
                                    fullWidth
                                    name='announceTitle'
                                    onChange={handleChange}
                                    />
                            </Grid>
                        </Grid>
                    </div>
                    <div className={`${style.announceTitle} ${style.borderWrite}`}>
                        <Grid container className={`${style.pl10} ${style.center}`} spacing={1}>
                            <Grid item xs={12}>
                                <Typography fontSize={18} fontWeight="bold">
                                    분류
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography fontSize={12}>
                                    
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Select
                                    labelId="demo-simple-select-required-label"
                                    id="demo-simple-select-required"
                                    value={announce.announceCategory}
                                    fullWidth
                                    onChange={handleChange}
                                    name='announceCategory'
                                    >
                                    <MenuItem value="none">선택</MenuItem>
                                    <MenuItem value="info">안내</MenuItem>
                                    <MenuItem value="news">서비스 소식</MenuItem>
                                    <MenuItem value="open">서비스 오픈</MenuItem>
                                    <MenuItem value="inspection">서비스 점검</MenuItem>
                                    <MenuItem value="close">서비스 종료</MenuItem>
                                </Select>
                            </Grid>
                        </Grid>
                    </div>
                    <hr/>
                    <Grid container className={`${style.pl10} ${style.center}`} spacing={10}>
                        <Grid item xs={12}>
                            <Reactquill id="editor" value={announce.announceContents} setValue={(value) => setAnnounce({ ...announce, announceContents: value })} style={{ height: "325px", width: "100%", height:"100%" }} />
                        </Grid>
                        <Grid item xs={12}>
                            <div className={`${style.center} ${style.btnEven}`}>
                                <Button variant="outlined" onClick={handleCancel}
                                    sx={{
                                        backgroundColor: '#4CAF50', // Default background color
                                        color: 'white', // Default text color
                                        '&:hover': {
                                            backgroundColor: '#45a049', // Change background color on hover
                                        },
                                    }}
                                >
                                    취소
                                </Button>
                                <Button variant="outlined" onClick={handleSubmit}
                                    sx={{
                                        backgroundColor: '#4CAF50', // Default background color
                                        color: 'white', // Default text color
                                        '&:hover': {
                                            backgroundColor: '#45a049', // Change background color on hover
                                        },
                                    }}
                                >
                                    작성
                                </Button>
                            </div>
                        </Grid>
                    </Grid>                    
                </div>
            </div>
        </div>
    )
}
export default AnnounceWriteMain;