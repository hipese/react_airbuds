import { Box, Grid, Icon, List, ListItem, Pagination, Typography } from "@mui/material";
import style from './qna.module.css';
import LockIcon from '@mui/icons-material/Lock';

const QnaList = () =>{
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
                    조회수
                    </Typography>
                </Box>
            </Grid>
            <Grid container className={`${style.announceLine}`}>
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
            <Pagination count={10} />
        </div>
        
    )
}
export default QnaList;