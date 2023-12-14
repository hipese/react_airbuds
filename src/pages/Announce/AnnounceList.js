import { Box, Grid, List, ListItem, Pagination, Typography } from "@mui/material";
import style from './announce.module.css';
import { Route, Routes, useNavigate } from "react-router-dom";
import AnnounceWriteMain from "../Announce/AnnounceWrite";
import AnnounceContents from '../Announce/AnnounceContents'
import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { useCookies } from "react-cookie";

const AnnounceList = () =>{    
    const [cookies, setCookie, removeCookie] = useCookies(["isViewed"]);
    
    const navi = useNavigate();
    
    const handleMove = (seq) => {
        if(cookies.isViewed == undefined || cookies.isViewed == false)
        {
            axios.put(`/api/announce/${seq}`).then(res=>{

            }).catch((e)=>{
                console.log(e);
            });
        }else{
            
        }

        if (seq != undefined || seq != null || seq != "") {
            const time = 3600; //1시간
            const expiration = new Date(Date.now() + time * 1000);
            setCookie("isViewed", true, { path: "/", expires: expiration });
            setTimeout(() => {
                setCookie("isViewed", false, { path: "/", expires: expiration });
            }, time * 1000); // 3초 후에 실행
        }
        navi(`contents/${seq}`)
    };
    const [announceList,setAnnounceList] = useState([]);
    useEffect(()=>{
        axios.get(`/api/announce`).then(res=>{
            console.log(res.data);
            setAnnounceList(res.data);
        }).catch((e)=>{
            console.log(e);
        });
    },[]);
    return(
        <div className={`${style.container}`}>
            <Grid container className={`${style.borderTB} ${style.boardLine} ${style.marginT70}`}>
                <Grid item xs={1} className={`${style.center}`}>
                    <Typography fontSize={{xs:"12px",sm:"14px"}}>
                    No
                    </Typography>
                </Grid>
                <Grid item xs={2} className={`${style.center}`}>
                    <Typography fontSize={{xs:"12px",sm:"14px"}}>
                    분류
                    </Typography>
                </Grid>
                <Grid item xs={5} className={`${style.center}`}>
                    <Typography fontSize={{xs:"12px",sm:"14px"}}>
                    제목
                    </Typography>
                </Grid>
                <Grid item xs={3} className={`${style.center}`}>
                    <Typography fontSize={{xs:"12px",sm:"14px"}}>
                    작성일자
                    </Typography>
                </Grid>
                <Box
                    component={Grid}
                    item
                    xs={1}
                    display={{ xs: "none", sm: "flex" }}
                    className={`${style.center}`}
                >                    
                    <Typography fontSize={{xs:"12px",sm:"14px"}}>
                    조회수
                    </Typography>
                </Box>
            </Grid>
            {announceList.map((e,i)=>{
                return(
                    <Grid container key={i} className={`${style.announceLine} ${style.pad10}`} onClick={()=>{handleMove(e.announceSeq)}}>
                        <Grid item xs={1} className={`${style.center}`}>                            
                            <Typography fontSize={{xs:"12px",sm:"14px"}}>                            
                                {e.announceSeq}
                            </Typography>
                        </Grid>
                        <Grid item xs={2} className={`${style.center}`}>
                            <Typography fontSize={{xs:"12px",sm:"14px"}}>
                                {e.announceCategory}
                            </Typography>
                        </Grid>
                        <Grid item xs={5} className={`${style.center}`}>
                            <Typography fontSize={{xs:"12px",sm:"14px"}}>
                                {e.announceTitle}
                            </Typography>
                        </Grid>
                        <Grid item xs={3} className={`${style.center}`}>
                            <Typography fontSize={{xs:"12px",sm:"14px"}}>
                                {e.announceWriteDate ? format(new Date(e.announceWriteDate),'yyyy-MM-dd')  : ""}
                            </Typography>
                        </Grid>
                        <Box
                            component={Grid}
                            item
                            xs={1}
                            display={{ xs: "none", sm: "flex" }}
                            className={`${style.center}`}
                        >                    
                            <Typography fontSize={{xs:"12px",sm:"14px"}}>
                                {e.announceViewCount}
                            </Typography>
                        </Box>
                    </Grid>
                )
            })}
            
            <div className={`${style.center}`}>
                <Pagination count={10} />
            </div>
        </div>
        
    )
}

const AnnounceMain = () => {
    return (
        <Routes>
            <Route path="/" element={<AnnounceList/>}></Route>
            <Route path="write" element={<AnnounceWriteMain/>}></Route>
            <Route path="contents/:seq" element={<AnnounceContents/>}></Route>
        </Routes>
    )
}
export default AnnounceMain;