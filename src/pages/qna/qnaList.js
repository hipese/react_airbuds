import { Box, Grid, Icon, List, ListItem, Pagination, Typography } from "@mui/material";
import style from './qna.module.css';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { useNavigate } from "react-router";
import { Link, Route, Routes } from "react-router-dom";
import QnaContents from './QnaContents';
import QnaWrite from './QnaWrite';


const QnaList =() => {
    const navi = useNavigate();
    const handleMove = () => {
        navi("contents");
    }
    return(
        <div className={`${style.container}`}>
            <Grid container className={`${style.borderTB} ${style.boardLine}`}>
                <Grid xs={1}>
                    <Typography fontSize={{xs:"12px",sm:"14px"}}>
                    No
                    </Typography>
                </Grid>
                <Grid xs={2}>
                    <Typography fontSize={{xs:"12px",sm:"14px"}}>
                    분류
                    </Typography>
                </Grid>
                <Grid xs={5}>
                    <Typography fontSize={{xs:"12px",sm:"14px"}}>
                    제목
                    </Typography>
                </Grid>
                <Grid xs={3}>
                    <Typography fontSize={{xs:"12px",sm:"14px"}}>
                    작성자
                    </Typography>
                </Grid>
                <Box
                    component={Grid}
                    item
                    xs={1}
                    display={{ xs: "none", sm: "flex" }}
                >                    
                    <Typography fontSize={{xs:"12px",sm:"14px"}}>
                    답변상태
                    </Typography>
                </Box>
            </Grid>
            <Grid container className={`${style.announceLine}`} onClick={handleMove}>
                <Grid xs={1}>
                    <Typography fontSize={{xs:"12px",sm:"14px"}}>
                    <LockIcon fontSize="small"/>
                    1
                    </Typography>
                </Grid>
                <Grid xs={2}>
                    <Typography fontSize={{xs:"12px",sm:"14px"}}>
                        서비스점검
                    </Typography>
                </Grid>
                <Grid xs={5}>
                    <Typography fontSize={{xs:"12px",sm:"14px"}}>
                    12월 6일 서버 점검
                    </Typography>
                </Grid>
                <Grid xs={3}>
                    <Typography fontSize={{xs:"12px",sm:"14px"}}>
                    운영자
                    </Typography>
                </Grid>
                <Box
                    component={Grid}
                    item
                    xs={1}
                    display={{ xs: "none", sm: "flex" }}
                >                    
                    <Typography fontSize={{xs:"12px",sm:"14px"}}>
                    1
                    </Typography>
                </Box>
            </Grid>
            <Grid container className={`${style.announceLine}`}>
                <Grid xs={1}>
                    <Typography fontSize={{xs:"12px",sm:"14px"}}>
                    <LockOpenIcon fontSize="small"/>
                    2
                    </Typography>
                </Grid>
                <Grid xs={2}>
                    <Typography fontSize={{xs:"12px",sm:"14px"}}>
                        서비스점검
                    </Typography>
                </Grid>
                <Grid xs={5}>
                    <Typography fontSize={{xs:"12px",sm:"14px"}}>
                    12월 6일 서버 점검
                    </Typography>
                </Grid>
                <Grid xs={3}>
                    <Typography fontSize={{xs:"12px",sm:"14px"}}>
                    운영자
                    </Typography>
                </Grid>
                <Box
                    component={Grid}
                    item
                    xs={1}
                    display={{ xs: "none", sm: "flex" }}
                >                    
                    <Typography fontSize={{xs:"12px",sm:"14px"}}>
                    1
                    </Typography>
                </Box>
            </Grid>
            <div className={`${style.rightAlign}`}>
                <Link to="write"><button>문의하기</button></Link>
            </div>            
            <Pagination count={10} />
        </div>
    )
}

const QnaListMain = () =>{
    return(
        <Routes>
            <Route path="/" element={<QnaList/>}></Route>
            <Route path="contents" element={<QnaContents/>}></Route>
            <Route path="write" element={<QnaWrite/>}></Route>
        </Routes>
    )     
}
export default QnaListMain;