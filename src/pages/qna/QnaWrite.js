import { Grid, MenuItem, Select, TextField, Typography } from '@mui/material';
import style from './qna.module.css'
import Reactquill from './ReactQuill';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
const QnaWriteMain = () =>{
    //writer 추후 수정해야함

    const [board, setBoard] = useState({qnaTitle:"",qnaWriter:"kwon", qnaCategory:"none",qnaPublic:1, qnaContents:"",qnaAnswerState:0,qnaWriteDate:new Date().toISOString()});
    const navi = useNavigate();
    const handleChange = (e) => {
        const {name,value} = e.target;
        console.log(name, value);
        setBoard(prev=>({...prev,[name]:value}));
    }
    const handleSubmit = () => {
        console.log(board);
        axios.post("/api/qna",board).then(res=>{
            console.log(res.data);
            navi("/qna");
        }).catch((e)=>{
            console.log(e);
        })
    }

    const handleCancel = () => {
        navi(-1);
    }
    return(
        <div className={`${style.wrap}`}>
            <div className={`${style.qnaWrite} ${style.ma} `}>
                <div className={`${style.marginT70}`}>
                    <div className={`${style.qnaTitle} ${style.borderWrite}`}>
                        <Grid container className={`${style.pl10} ${style.center}`} spacing={1}>
                            <Grid item xs={12}>
                                <Typography fontSize={18} fontWeight="bold">
                                    제목
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography fontSize={12}>
                                    관리자에게 물어보고 싶은 것을 상세하게 적어주세요.
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="제목"
                                    id="outlined-size-small"
                                    size="small"
                                    fullWidth
                                    name='qnaTitle'
                                    onChange={handleChange}
                                    />
                            </Grid>
                        </Grid>
                    </div>
                    <div className={`${style.qnaTitle} ${style.borderWrite}`}>
                        <Grid container className={`${style.pl10} ${style.center}`} spacing={1}>
                            <Grid item xs={12}>
                                <Typography fontSize={18} fontWeight="bold">
                                    분류
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography fontSize={12}>
                                    관리자에게 물어보고 싶은 분야를 선택해주세요.
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Select
                                    labelId="demo-simple-select-required-label"
                                    id="demo-simple-select-required"
                                    value={board.qnaCategory}
                                    fullWidth
                                    onChange={handleChange}
                                    name='qnaCategory'
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
                    <div className={`${style.qnaTitle} ${style.borderWrite}`}>
                        <Grid container className={`${style.pl10} ${style.center}`} spacing={1}>
                            <Grid item xs={12}>
                                <Typography fontSize={18} fontWeight="bold">
                                    공개여부
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography fontSize={12}>
                                    질문의 공개여부를 선택할 수 있습니다.
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Select
                                    labelId="demo-simple-select-required-label"
                                    id="demo-simple-select-required"
                                    value={board.qnaPublic}
                                    fullWidth
                                    name='qnaPublic'
                                    onChange={handleChange}
                                    >
                                    <MenuItem value={1}>공개</MenuItem>
                                    <MenuItem value={0}>비공개</MenuItem>
                                </Select>
                            </Grid>
                        </Grid>
                    </div>
                    <hr/>
                    <Grid container className={`${style.pl10} ${style.center}`} spacing={10}>
                            <Grid item xs={12}>
                                <Reactquill id="editor" value={board.qnaContents} setValue={(value) => setBoard({ ...board, qnaContents: value })} style={{ height: "325px", width: "100%", height:"100%" }} />
                            </Grid>
                            <Grid item xs={12}>
                                <input type="file" multiple name='files'/>
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
export default QnaWriteMain;