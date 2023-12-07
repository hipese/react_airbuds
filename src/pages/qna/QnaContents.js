import { Avatar, Box, Button, Divider, Grid, Typography } from '@mui/material';
import style from './qna.module.css'
import { useNavigate } from 'react-router';
const QnaContents = () => {

    //관리자 및 글 작성자 외에는 못들어오도록 하기
    const navi = useNavigate();
    const handleMoveToList = () => {
        navi(-1);
    }

    return(
        <div className={`${style.wrap}`}>
            <div className={`${style.qnaContents} ${style.ma} ${style.border}`}>
                <div className={`${style.marginT70}`}>
                    <Grid container className={`${style.pl10} ${style.center}`}>
                        <Grid item xs={12}>
                            <Typography fontSize={24}>
                                Title
                            </Typography>
                        </Grid>
                    </Grid>
                    <hr/>
                    <Grid container className={`${style.pl10} ${style.center}`}>
                        <Grid item xs={12} sm={6}>
                            <Typography fontSize={12}>
                                분류  : Category
                            </Typography>
                        </Grid>                        
                        <Grid item xs={12} sm={6}>
                            <Typography fontSize={{xs:"12px",sm:"14px"}} className={`${style.rightAlign}`}>
                            작성자 : kwon
                            </Typography>
                        </Grid>
                    </Grid>
                    <hr/>
                    <div className={`${style.qnaDetail} ${style.border} ${style.borderRad} ${style.ma}`}>
                        asd
                    </div>
                    <div className={`${style.pad10} ${style.rightAlign}`}>
                        <button onClick={handleMoveToList}>목록으로</button>
                    </div>
                </div>

                {/* Reply */}
                <div>
                    <Grid container className={`${style.qnaReply} ${style.center} ${style.border} ${style.pad10} ${style.ma}`}>
                        <Grid item xs={12} sm={3}>
                                <Grid container>
                                    <Grid item xs={12} className={`${style.center}`}>
                                        <Avatar
                                            alt="Remy Sharp"
                                            src="/static/images/avatar/1.jpg"
                                            sx={{ width: 56, height: 56}}
                                            />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <div className={`${style.center}`}>
                                            name : kwon
                                        </div>
                                    </Grid>
                                </Grid>
                        </Grid>
                        <Grid item xs={12} sm={9}>
                            <div className={`${style.border} ${style.replyContents} ${style.pad10}`}>
                            replyreplyr
                            </div>
                            <div className={`${style.replyBtnEven} ${style.padingT10}`}>
                                <Button variant="outlined" size="small">
                                    Delete
                                </Button>
                                {/* isUpdate state 추가, true면 update btn out, submit button in */}
                                <Button variant="outlined" size="small">
                                    Update
                                </Button>
                            </div>
                        </Grid>
                    </Grid>
                    <Grid container className={`${style.qnaReply} ${style.center} ${style.border} ${style.ma} ${style.pad10}`}>
                        <Grid item xs={12} sm={3}>
                                <Grid container>
                                    <Grid item xs={12} className={`${style.center}`}>
                                        <Avatar
                                            alt="Remy Sharp"
                                            src="/static/images/avatar/1.jpg"
                                            sx={{ width: 56, height: 56}}
                                            />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <div className={`${style.center}`}>
                                            name : kwon
                                        </div>
                                    </Grid>
                                </Grid>
                        </Grid>
                        <Grid item xs={12} sm={9}>
                            <div className={`${style.border} ${style.replyContents} ${style.pad10}`}>
                            replyreplyr
                            </div>
                        </Grid>
                    </Grid>
                </div>
            </div>
        </div>

        
    )
}
export default QnaContents;