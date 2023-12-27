import { useNavigate, useParams } from "react-router"
import style from './announce.module.css'
import { Button, Grid, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { LoginContext } from "../../App";

const AnnounceContentsMain = () => {
    const {loginID} = useContext(LoginContext);
    const {seq} = useParams();
    const navi = useNavigate();

    const [detail,setDetail] = useState({});

    useEffect(()=>{
        axios.get(`/api/announce/${seq}`).then(res=>{
            setDetail(res.data);
        }).catch((e)=>{
            console.log(e);
        });
    },[]);

    const handleToList = () => {
        navi("/Announce");
    }

    const handleDeleteAnnounce = () => {
        axios.delete(`/api/announce/${seq}`).then(res=>{
            navi("/Announce");
        }).catch((e)=>{
            console.log(e);
        });
    }
    return(
        <div className={`${style.wrap}`}>
            <div className={`${style.announceContents} ${style.ma}`}>
                <div className={`${style.marginT70}`}>
                    <Grid container className={`${style.pl10} ${style.center}`}>
                        <Grid item xs={12}>
                            <Typography fontSize={24}>
                                {detail.announceTitle}
                            </Typography>
                        </Grid>
                    </Grid>
                    <hr/>
                    <Grid container className={`${style.pl10} ${style.center}`}>
                        <Grid item xs={12} sm={6}>
                            <Typography fontSize={12}>
                                카테고리 : {
                                    detail.announceCategory == "open" ? "서비스 오픈" :
                                    detail.announceCategory == "info" ? "안내" :
                                    detail.announceCategory == "news" ? "서비스 소식" :
                                    detail.announceCategory == "inspection" ? "서비스 점검" :
                                    detail.announceCategory == "close" ? "서비스 오픈종료" : ""
                                }
                            </Typography>
                        </Grid>                        
                        <Grid item xs={12} sm={6}>
                            <Typography fontSize={{xs:"12px",sm:"14px"}} className={`${style.rightAlign}`}>
                                작성자 : {detail.announceWriter}
                            </Typography>
                        </Grid>
                    </Grid>
                    <hr/>
                    <div className={`${style.announceDetail} ${style.border} ${style.borderRad} ${style.ma}`} dangerouslySetInnerHTML={{ __html: detail.announceContents }}>
                    </div>
                    <hr/>
                    <Grid container className={`${style.pl10} ${style.center}`}>
                        <Grid item xs={12} sm={4} className={`${style.rightAlign}`}>
                            
                            { detail.announceWriter == loginID 
                                ? <div className={`${style.btnEven}`}>
                                    <Button variant="contained" onClick={handleDeleteAnnounce}>삭제하기</Button>
                                    <Button variant="outlined" onClick={handleToList}>목록으로</Button>
                                </div>
                                :
                                <div className={`${style.btnEven}`}>
                                    <Button variant="outlined" onClick={handleToList}>목록으로</Button>
                                </div>
                            }

                        </Grid>
                    </Grid>
                    <hr/>
                </div>
            </div>
        </div>
    )
}
export default AnnounceContentsMain;