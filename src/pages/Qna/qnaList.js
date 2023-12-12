import { Box, Grid, Icon, List, ListItem, Pagination, Typography } from "@mui/material";
import style from './qna.module.css';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { useNavigate } from "react-router";
import { Link, Route, Routes } from "react-router-dom";
import QnaContents from './QnaContents';
import QnaWrite from './QnaWrite';
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";


const QnaList =() => {
    const {qnaList,setQnaList} = useContext(QnaContext);
    const navi = useNavigate();
    const handleMove = (e,i) => {
        console.log(i);
        navi(`contents/${e}`);
    }

    useEffect(()=>{
        axios.get("/api/qna").then(res=>{
            console.log(res.data);
            setQnaList(res.data);
        }).catch((e)=>{
            console.log(e);
        });
    },[]);
    return(
        <div className={`${style.container}`}>
            <Grid container className={`${style.marginT70} ${style.borderTB} ${style.boardLine} ${style.pad10} `}>
                <Grid xs={1} className={`${style.center}`}>
                    <Typography fontSize={{xs:"12px",sm:"14px"}}>
                    No
                    </Typography>
                </Grid>
                <Grid xs={2} className={`${style.center}`}>
                    <Typography fontSize={{xs:"12px",sm:"14px"}}>
                    분류
                    </Typography>
                </Grid>
                <Grid xs={5} className={`${style.center}`}>
                    <Typography fontSize={{xs:"12px",sm:"14px"}}>
                    제목
                    </Typography>
                </Grid>
                <Grid xs={3} className={`${style.center}`}>
                    <Typography fontSize={{xs:"12px",sm:"14px"}}>
                    작성자
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
                    답변상태
                    </Typography>
                </Box>
            </Grid>
            {qnaList.map((e,i)=>{
                return(
                    <Grid key={i} container className={`${style.announceLine} ${style.pad10}`} onClick={()=>{handleMove(e.qnaSeq,e.qnaPublic)}}>
                        <Grid xs={1} className={`${style.center}`}>
                            {e.qnaPublic == 0 ? <LockIcon fontSize="small"/> : <LockOpenIcon fontSize="small"/>}
                            <Typography fontSize={{xs:"12px",sm:"14px"}}>                            
                            {e.qnaSeq}
                            </Typography>
                        </Grid>
                        <Grid xs={2} className={`${style.center}`}>
                            <Typography fontSize={{xs:"12px",sm:"14px"}}>
                                {
                                    e.qnaCategory == "usurpation" ? "권리 침해" : 
                                    e.qnaCategory == "service" ? "서비스 문의" :
                                    e.qnaCategory == "event" ? "이벤트" :
                                    e.qnaCategory == "error" ? "기타 오류" : ""
                                }
                            </Typography>
                        </Grid>
                        <Grid xs={5} className={`${style.center}`}>
                            <Typography fontSize={{xs:"12px",sm:"14px"}}>
                                {e.qnaTitle}
                            </Typography>
                        </Grid>
                        <Grid xs={3} className={`${style.center}`}>
                            <Typography fontSize={{xs:"12px",sm:"14px"}}>
                                {e.qnaWriter}
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
                                {e.qnaAnswerState == 0 ? "답변 대기" : "답변 완료"}
                            </Typography>
                        </Box>
                    </Grid>
                )
            })}
            <div className={`${style.rightAlign}`}>
                <Link to="write"><button>문의하기</button></Link>
            </div>           
            <div className={`${style.center}`}>
                <Pagination count={10} />
            </div>            
        </div>
    )
}
export const QnaContext = createContext();

const QnaListMain = () =>{
    const [qnaList,setQnaList] = useState([]);
    return(
        <QnaContext.Provider value={{qnaList,setQnaList}}>
            <Routes>
                <Route path="/" element={<QnaList/>}></Route>
                <Route path="contents/:seq" element={<QnaContents/>}></Route>
                <Route path="write" element={<QnaWrite/>}></Route>
            </Routes>
        </QnaContext.Provider>
    )     
}
export default QnaListMain;