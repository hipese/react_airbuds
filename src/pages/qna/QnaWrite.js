import { Grid, MenuItem, Select, TextField, Typography } from '@mui/material';
import style from './qna.module.css'
import Reactquill from './ReactQuill';
import { useState } from 'react';
const QnaWriteMain = () =>{
    const [board, setBoard] = useState({});
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
                                    value="system"
                                    fullWidth
                                    >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value="system">시스템</MenuItem>
                                    <MenuItem value={20}>Twenty</MenuItem>
                                    <MenuItem value={30}>Thirty</MenuItem>
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
                                    value="public"
                                    fullWidth
                                    >
                                    <MenuItem value="public">공개</MenuItem>
                                    <MenuItem value="private">비공개</MenuItem>
                                </Select>
                            </Grid>
                        </Grid>
                    </div>
                    <hr/>
                    <Grid container className={`${style.pl10} ${style.center}`} spacing={10}>
                            <Grid item xs={12}>
                                <Reactquill id="editor" value={board.contents} setValue={(value) => setBoard({ ...board, contents: value })} style={{ height: "325px", width: "100%", height:"100%" }} />
                            </Grid>
                            <Grid item xs={12}>
                                <div className={`${style.center} ${style.btnEven}`}>
                                    <button>취소</button>   
                                    <button>작성</button>
                                </div>
                            </Grid>
                        </Grid>
                    
                </div>
            </div>
        </div>
    )
}
export default QnaWriteMain;