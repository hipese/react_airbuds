import { Box, Button, Grid, Icon, List, ListItem, Pagination, PaginationItem, Typography } from "@mui/material";
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

    const [currentPage, setCurrentPage] = useState(1);
    const COUNT_PER_PAGE = 8;

    const totalItems = qnaList.length;
    const totalPages = Math.ceil(totalItems / COUNT_PER_PAGE);

    const startIndex = (currentPage - 1) * COUNT_PER_PAGE;
        const endIndex = Math.min(startIndex + COUNT_PER_PAGE, totalItems);
        const visibleQnaList = qnaList.slice(startIndex, endIndex);

    const onPageChange = (e, page) => {
            setCurrentPage(page);
        };

    

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
            {visibleQnaList.map((e,i)=>{
                return(
                    <Grid key={i} container className={`${style.announceLine} ${style.pad10}`} onClick={()=>{handleMove(e.qnaSeq,e.qnaPublic)}}>
                        <Grid item xs={1} className={`${style.center}`}>
                            {e.qnaPublic == 0 ? <LockIcon fontSize="small"/> : <LockOpenIcon fontSize="small"/>}
                            <Typography fontSize={{xs:"12px",sm:"14px"}}>                            
                            {e.qnaSeq}
                            </Typography>
                        </Grid>
                        <Grid item xs={2} className={`${style.center}`}>
                            <Typography fontSize={{xs:"12px",sm:"14px"}}>
                                {
                                    e.qnaCategory == "usurpation" ? "권리 침해" : 
                                    e.qnaCategory == "service" ? "서비스 문의" :
                                    e.qnaCategory == "event" ? "이벤트" :
                                    e.qnaCategory == "error" ? "기타 오류" : ""
                                }
                            </Typography>
                        </Grid>
                        <Grid item xs={5} className={`${style.center}`}>
                            <Typography fontSize={{xs:"12px",sm:"14px"}}>
                                {e.qnaTitle}
                            </Typography>
                        </Grid>
                        <Grid item xs={3} className={`${style.center}`}>
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
                <Link to="write">
                    <Button variant="contained">문의하기</Button>
                </Link>
            </div>           
            <div className={`${style.center}`}>
                <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={onPageChange}
                    size="medium"
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        padding: "15px 0",
                    }}
                    renderItem={(item) => (
                        <PaginationItem {...item} sx={{ fontSize: 12 }} />
                    )}
                />
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