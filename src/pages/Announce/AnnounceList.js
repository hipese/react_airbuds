import { Box, Grid, List, ListItem, Pagination, Typography } from "@mui/material";
import style from './announce.module.css';
import { Route, Routes } from "react-router-dom";
import AnnounceWriteMain from "./AnnounceWrite";

const AnnounceList = () =>{
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
                    조회수
                    </Typography>
                </Box>
            </Grid>
            <Grid container className={`${style.announceLine} ${style.pad10}`}>
                <Grid item xs={1} className={`${style.center}`}>                            
                    <Typography fontSize={{xs:"12px",sm:"14px"}}>                            
                        1
                    </Typography>
                </Grid>
                <Grid item xs={2} className={`${style.center}`}>
                    <Typography fontSize={{xs:"12px",sm:"14px"}}>
                        2
                    </Typography>
                </Grid>
                <Grid item xs={5} className={`${style.center}`}>
                    <Typography fontSize={{xs:"12px",sm:"14px"}}>
                        2
                    </Typography>
                </Grid>
                <Grid item xs={3} className={`${style.center}`}>
                    <Typography fontSize={{xs:"12px",sm:"14px"}}>
                        6
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
                        7
                    </Typography>
                </Box>
            </Grid>
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
        </Routes>
    )
}
export default AnnounceMain;