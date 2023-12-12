import { Grid, MenuItem, Select, TextField, Typography } from '@mui/material';
import style from './announce.module.css'
import Reactquill from './ReactQuill';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
const AnnounceWriteMain = () =>{

    const [announce, setAnnounce] = useState({announceTitle:"",announceWriter:"kwon", announceCategory:"none",announcePublic:1, announceContents:"",announceAnswerState:0,announceWriteDate:new Date().toISOString(),files:[]});

    const navi = useNavigate();
    const handleChange = (e) => {
        const {name,value} = e.target;
        console.log(name, value);
        setAnnounce(prev=>({...prev,[name]:value}));
    }
    const handleSubmit = () => {
        console.log(announce);
        const formData = new FormData();
        formData.append("announceTitle",announce.announceTitle);
        formData.append("announceWriter",announce.announceWriter);
        formData.append("announceCategory",announce.announceCategory);
        formData.append("announcePublic",announce.announcePublic);
        formData.append("announceContents",announce.announceContents);
        formData.append("announceAnswerState",announce.announceAnswerState);
        formData.append("announceWriteDate",announce.announceWriteDate);
        for(const file of announce.files){
            formData.append("files",file);
        }
        console.log(formData);
        axios.post("/api/announce",formData).then(res=>{
            navi("/announce");
        }).catch((e)=>{
            console.log(e);
        });
    }

    const handleFileChange = (e) => {
        setAnnounce(prev=>({...prev,files:[...e.target.files]}));
    }

    const handleCancel = () => {
        navi(-1);
    }
    return(
        <div className={`${style.wrap}`}>
            <div className={`${style.announceWrite} ${style.ma} `}>
                <div className={`${style.marginT70}`}>
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
                                    label="제목2"
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
                                    <MenuItem value="service">서비스 문의</MenuItem>
                                    <MenuItem value="event">이벤트</MenuItem>
                                    <MenuItem value="usurpation">권리침해</MenuItem>
                                    <MenuItem value="error">기타오류</MenuItem>
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
                                <button onClick={handleCancel}>취소</button>   
                                <button onClick={handleSubmit}>작성</button>
                            </div>
                        </Grid>
                    </Grid>                    
                </div>
            </div>
        </div>
    )
}
export default AnnounceWriteMain;