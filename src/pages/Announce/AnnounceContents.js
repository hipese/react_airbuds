import { useParams } from "react-router"
import style from './announce.module.css'
import { Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";

const AnnounceContentsMain = () => {
    const loginID = "kwon";
    const {seq} = useParams();

    const [detail,setDetail] = useState({});

    useEffect(()=>{
        axios.get(`/api/announce/${seq}`).then(res=>{
            setDetail(res.data);
        }).catch((e)=>{
            console.log(e);
        });
    },[]);
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
                                카테고리 : {detail.announceCategory}
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
                            
                            { "kwon" == loginID ? <div className={`${style.btnEven}`}><button>삭제하기</button>
                                                                <button>목록으로</button></div>
                                                                :<button>목록으로</button>}
                        </Grid>
                    </Grid>
                    <hr/>
                </div>
            </div>
        </div>
    )
}
export default AnnounceContentsMain;