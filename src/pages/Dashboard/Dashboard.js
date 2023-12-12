import { Route, Routes } from "react-router-dom";
import style from './dashboard.module.css'
import { Grid } from "@mui/material";
import LineChart from './charts/line'
import { Line } from "@nivo/line";

const DashBoardDisplay = () => {
    return(
        <div className={`${style.dashcontainer} ${style.ma}`}>
            <div id="title" className={`${style.pad10}`}>
                    Dashboard
            </div>
            
            <Grid container spacing={3} sx={{width:"100%"}}>
                <Grid item xs={12} md={4} className={`${style.center}`}>
                    <div className={`${style.dashBox} ${style.pad10}`}>
                        Daliy Visitor
                    </div>
                </Grid>
                <Grid item xs={12} sm={4} className={`${style.center}`}>
                    <div className={`${style.dashBox} ${style.pad10}`}>
                        Today Streaming
                    </div>
                </Grid>
                <Grid item xs={12} sm={4} className={`${style.center}`}>
                    <div className={`${style.dashBox} ${style.pad10}`}>

                    </div>
                </Grid>
                <Grid item sx={12} className={`${style.center} ${style.w100}`}>
                    <div className={`${style.dashLBox}`}>
                        <LineChart/>
                    </div>                    
                </Grid>

            </Grid>            
        </div>
    )
}

const DashBoardMain = () => {
    return(
        <Routes>
            <Route path="/" element={<DashBoardDisplay/>}></Route>
        </Routes>
    )
}
export default DashBoardMain;