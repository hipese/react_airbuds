import * as React from 'react';
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import style from './dashboard.module.css'
import { styled } from '@mui/material/styles';
import { Box, Button, Divider, Drawer, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Tab, Tooltip, Typography } from "@mui/material";
import LineChart from './charts/line'
import FunnelChart from './charts/funnel'
import { Line } from "@nivo/line";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import axios from 'axios';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        background: theme.palette.mode === 'light' ? 'linear-gradient(to right, #25aae1, #40e495, #30dd8a, #2bb673)' : 'linear-gradient(to right, #25aae1, #40e495, #30dd8a, #2bb673)',
    },
}));

const RedLinearProgress = styled(LinearProgress)(
    ({theme})=>(
        {
            height:10,
            borderRadius:5,
            [`&.${linearProgressClasses.colorPrimary}`]: {
                backgroundColor: theme.palette.grey[200],
            },
            [`& .${linearProgressClasses.bar}`]:{
                borderRadius: 5,
                background:'linear-gradient(45deg, #fe6b8b 30%, #ff8e53 90%)',
            }
        }        
));

const BlueLinearProgress = styled(LinearProgress)(
    ({theme})=>(
        {
            height:10,
            borderRadius:5,
            [`&.${linearProgressClasses.colorPrimary}`]: {
                backgroundColor: theme.palette.grey[200],
            },
            [`& .${linearProgressClasses.bar}`]:{
                borderRadius: 5,
                background:'linear-gradient(to right, #25aae1, #4481eb, #04befe, #3f86ed)',
            }
        }        
));

const DashBoardDisplay = () => {
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });
    
    
    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
    
        setState({ ...state, [anchor]: open });
    };

    const navi = useNavigate();

    const handleDrawerClick = (e,i) => {
        navi(i);
    }
    
    const list = (anchor) => (
    <Box
        sx={{ width: 250 }}
        role="presentation"
        onClick={toggleDrawer(anchor, false)}
        onKeyDown={toggleDrawer(anchor, false)}
    >
        <List>            
            <ListItem disablePadding>
                <ListItemButton value="dashboard">
                    <ListItemText primary="" />
                </ListItemButton>  
            </ListItem>
            <ListItem disablePadding>
                <ListItemButton>
                    <ListItemText primary="" />
                </ListItemButton>  
            </ListItem>
            <ListItem disablePadding>
                <ListItemButton onClick={(event)=>{handleDrawerClick(event,"/dashboard")}}>
                    <ListItemText primary="대시보드"/>
                </ListItemButton>  
            </ListItem>
            <ListItem disablePadding>
                <ListItemButton onClick={(event)=>{handleDrawerClick(event,"/announce/write")}}>
                    <ListItemText primary="공지 작성" />
                </ListItemButton>  
            </ListItem>
            <ListItem disablePadding>
                <ListItemButton onClick={(event)=>{handleDrawerClick(event,"/report")}}>
                    <ListItemText primary="신고" />
                </ListItemButton>  
            </ListItem>  
        </List>
        <Divider />
    </Box>
    );

    const [value, setValue] = React.useState('1');

    const [visitor,setVisitor] = React.useState(40);
    const [streaming,setStreaming] = React.useState(23);
    const [report,setReport] = React.useState(58);
    const [formdReport,setFormdReport] = React.useState([]);
    const [formdMusic,setFormdMusic] = React.useState([]);
    const [formdmember,setFormdMember] = React.useState([]);
    const [dailyReport,setDailyReport] = React.useState(0);
    const [dailyVisitor,setDailyVisitor] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const groupByYear = (javaData) => {
        const groupedData = javaData.reduce((result, item) => {
            const year = item.year;
            if (!result[year]) {
            result[year] = [];
            }
            result[year].push(item);
            return result;
        }, {});
        
        return groupedData;
    };

    // const transformToLineData = (groupedData) => {
    //     const reactData = Object.entries(groupedData).map(([year, data]) => ({
    //         id: parseInt(year),
    //         color : `hsl(166, 70%, 50%)`,
    //         data: data.map(item => ({
    //         x: `${item.month}월`,
    //         y: item.count,
    //         })),
    //     }));
        
    //     return reactData;
    // };
    const transformToLineData = (groupedData) => {
        const reactData = Object.entries(groupedData).map(([year, data]) => {
        const months = Array.from({ length: 12 }, (_, index) => index + 1); // 1부터 12까지의 숫자 배열 생성
    
        const transformedData = months.map(month => {
        const monthData = data.find(item => item.month === month);
            return {
                x: `${month}월`,
                y: monthData ? monthData.count : 0,
            };
            });
        
            return {
            id: parseInt(year),
            color: `hsl(166, 70%, 50%)`,
            data: transformedData,
            };
        });
    
    return reactData;
    };   

    React.useEffect(()=>{
        axios.get(`/api/dashboard/report`).then(res=>{
            console.log(res.data);
            const groupedData = groupByYear(res.data);
            const reactData = transformToLineData(groupedData);
            setFormdReport(reactData);
        }).catch((e)=>{
        });

        axios.get(`/api/dashboard/music`).then(res=>{
            const groupedData = groupByYear(res.data);
            const reactData = transformToLineData(groupedData);
            setFormdMusic(reactData);
        }).catch((e)=>{
            console.log(e);
        });

        axios.get(`/api/dashboard/member`).then(res=>{
            const transformedData = res.data.map(item => ({
                id: item.ageGroup,
                value: item.count,
                label: item.ageGroup
            }));

            const sortedData = transformedData.sort((a, b) => {
                return b.id.localeCompare(a.id);
            });
            setFormdMember(sortedData);
        }).catch((e)=>{
            console.log(e);
        });

        axios.get("/api/dashboard/reportCount").then(res=>{
            console.log(res.data);
            setDailyReport(res.data);
        }).catch((e)=>{
            console.log(e);
        });
        
        axios.get("/api/dashboard/visitorCount").then(res=>{
            console.log(res.data);
            setDailyVisitor(res.data);
        }).catch((e)=>{
            console.log(e);
        });

    },[]);
    
    return(
        <Box className={`${style.dashcontainer} ${style.ma}`}>
            <div id="title" className={`${style.pad10}`}>
                <Typography fontSize={13}>
                    Dashboard   <Button onClick={toggleDrawer('left', true)}>Menu</Button>
                </Typography>               
                <Drawer
                    anchor={'left'}
                    open={state['left']}
                    onClose={toggleDrawer('left', false)}
                >
                    {list('left')}
                </Drawer>
            </div>
            <Grid container spacing={3} sx={{width:"100%"}}>
                <Grid item xs={12} md={4} className={`${style.center}`}>
                    <Tooltip title="Daily Visitor">
                        <div className={`${style.dashBox}`}>
                            <div className={`${style.pad10}`}>
                                <Typography fontSize={13}>
                                    Daliy Visitor
                                </Typography>                        
                                <Typography fontSize={38} paddingLeft={4} className={`${style.visitortext}`}>
                                    {dailyVisitor} 명
                                </Typography>
                                <div className={`${style.progressBar} ${style.pad5}`}>
                                    <BorderLinearProgress variant="determinate" value={visitor > 100 ? 100 : visitor} />
                                </div>
                            </div>                                                
                        </div>
                    </Tooltip>
                </Grid>
                <Grid item xs={12} md={4} className={`${style.center}`}>
                    <Tooltip title="Today Streaming">
                        <div className={`${style.dashBox}`}>
                            <div className={`${style.pad10}`}>
                                <Typography fontSize={13}>
                                    Today Streaming
                                </Typography>                        
                                <Typography fontSize={40} paddingLeft={2}>
                                    {streaming}%
                                </Typography>
                                <div className={`${style.progressBar} ${style.pad5}`}>
                                    <RedLinearProgress variant='determinate' value={streaming > 100 ? 100 : streaming}/>
                                </div>
                            </div>                                                
                            
                        </div>
                    </Tooltip>
                </Grid>
                <Grid item xs={12} md={4} className={`${style.center}`}>
                    <Tooltip title="Today Report">
                        <div className={`${style.dashBox}`}>
                            <div>
                                <div className={`${style.pad10} ${style.report}`}>
                                    <Typography fontSize={13} color={'white'} fontWeight={'bold'}>
                                        Today Report
                                    </Typography>                        
                                    <Typography fontSize={38} paddingLeft={2} color={'white'}>
                                        {dailyReport} 건
                                    </Typography>
                                </div>
                                <div className={`${style.progressBar}`}>
                                    {/* <BlueLinearProgress variant='determinate' value={report > 100 ? 100 : report}/> */}
                                </div>
                            </div>                                                
                            
                        </div>
                    </Tooltip>
                </Grid>
            </Grid>
            <Box sx={{ width: '100%', typography: 'body1' }} className={`${style.marginT20}`}>
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                        <Tab label="Report" value="1" />
                        <Tab label="Music" value="2" />
                        <Tab label="Member" value="3" />
                    </TabList>
                    </Box>
                    <TabPanel value="1">
                        <Grid container spacing={3} sx={{width:"100%"}}>
                            <Box
                                component={Grid}
                                item
                                xs={12}
                                // display={{ xs: "none", md: "flex" }}
                                className={`${style.center} ${style.w100}`}
                            >                    
                                <div className={`${style.dashLBox}`}>
                                    <LineChart data={formdReport} theme={"Report"}/>
                                </div>   
                            </Box>
                        </Grid>                        
                    </TabPanel>
                    <TabPanel value="2">
                        <Grid container spacing={3} sx={{width:"100%"}}>
                            <Box
                                component={Grid}
                                item
                                xs={12}
                                // display={{ xs: "none", md: "flex" }}
                                className={`${style.center} ${style.w100}`}
                            >                    
                                <div className={`${style.dashLBox}`}>                                    
                                    <LineChart data={formdMusic} theme={"Music"}/>
                                </div>   
                            </Box>
                        </Grid>
                    </TabPanel>
                    <TabPanel value="3">
                        <Grid container spacing={3} sx={{width:"100%"}}>
                            <Box
                                component={Grid}
                                item
                                xs={12}
                                // display={{ xs: "none", md: "flex" }}
                                className={`${style.center} ${style.w100}`}
                            >                    
                                <div className={`${style.dashLBox}`}>
                                    <FunnelChart data={formdmember}/>
                                </div>   
                            </Box>
                        </Grid>
                    </TabPanel>
                </TabContext>
            </Box>
        </Box>
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