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

const data = [{
    "id": "10대",
    "color": "hsl(166, 70%, 50%)",
    "data": [
      {
        "x": "1월",
        "y": 47
      },
      {
        "x": "2월",
        "y": 27
      },
      {
        "x": "3월",
        "y": 228
      },
      {
        "x": "4월",
        "y": 49
      },
      {
        "x": "5월",
        "y": 100
      },
      {
        "x": "6월",
        "y": 68
      },
      {
        "x": "7월",
        "y": 76
      },
      {
        "x": "8월",
        "y": 135
      },
      {
        "x": "9월",
        "y": 224
      },
      {
        "x": "10월",
        "y": 112
      },
      {
        "x": "11월",
        "y": 210
      },
      {
        "x": "12월",
        "y": 54
      }
    ]
  },
  {
    "id": "20대",
    "color": "hsl(166, 70%, 50%)",
    "data": [
      {
        "x": "1월",
        "y": 47
      },
      {
        "x": "2월",
        "y": 27
      },
      {
        "x": "3월",
        "y": 228
      },
      {
        "x": "4월",
        "y": 49
      },
      {
        "x": "5월",
        "y": 100
      },
      {
        "x": "6월",
        "y": 68
      },
      {
        "x": "7월",
        "y": 76
      },
      {
        "x": "8월",
        "y": 135
      },
      {
        "x": "9월",
        "y": 224
      },
      {
        "x": "10월",
        "y": 112
      },
      {
        "x": "11월",
        "y": 210
      },
      {
        "x": "12월",
        "y": 54
      }
    ]
  },
  {
    "id": "30대",
    "color": "hsl(166, 70%, 50%)",
    "data": [
      {
        "x": "1월",
        "y": 47
      },
      {
        "x": "2월",
        "y": 27
      },
      {
        "x": "3월",
        "y": 228
      },
      {
        "x": "4월",
        "y": 49
      },
      {
        "x": "5월",
        "y": 100
      },
      {
        "x": "6월",
        "y": 68
      },
      {
        "x": "7월",
        "y": 76
      },
      {
        "x": "8월",
        "y": 135
      },
      {
        "x": "9월",
        "y": 224
      },
      {
        "x": "10월",
        "y": 112
      },
      {
        "x": "11월",
        "y": 210
      },
      {
        "x": "12월",
        "y": 54
      }
    ]
  },
  {
    "id": "40대",
    "color": "hsl(166, 70%, 50%)",
    "data": [
      {
        "x": "1월",
        "y": 47
      },
      {
        "x": "2월",
        "y": 27
      },
      {
        "x": "3월",
        "y": 228
      },
      {
        "x": "4월",
        "y": 49
      },
      {
        "x": "5월",
        "y": 100
      },
      {
        "x": "6월",
        "y": 68
      },
      {
        "x": "7월",
        "y": 76
      },
      {
        "x": "8월",
        "y": 135
      },
      {
        "x": "9월",
        "y": 224
      },
      {
        "x": "10월",
        "y": 112
      },
      {
        "x": "11월",
        "y": 210
      },
      {
        "x": "12월",
        "y": 54
      }
    ]    
  }];

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

    const transformToReactData = (groupedData) => {
        const reactData = Object.entries(groupedData).map(([year, data]) => ({
            id: parseInt(year),
            color : `hsl(166, 70%, 50%)`,
            data: data.map(item => ({
            x: `${item.month}월`,
            y: item.count,
            })),
        }));
        
        return reactData;
    };

    React.useEffect(()=>{
        axios.get(`/api/dashboard`).then(res=>{
            console.log(res.data);
            const groupedData = groupByYear(res.data);
            const reactData = transformToReactData(groupedData);
            setFormdReport(reactData);
            console.log(reactData);
        })
    },[]);
    
    return(
        <div className={`${style.dashcontainer} ${style.ma}`}>
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
                                <Typography fontSize={40} paddingLeft={2}>
                                    {visitor}%
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
                    <Tooltip title="Anything">
                        <div className={`${style.dashBox}`}>
                            <div className={`${style.pad10}`}>
                                <Typography fontSize={13}>
                                    Today Report
                                </Typography>                        
                                <Typography fontSize={40} paddingLeft={2}>
                                    {report}%
                                </Typography>
                                <div className={`${style.progressBar} ${style.pad5}`}>
                                    <BlueLinearProgress variant='determinate' value={report > 100 ? 100 : report}/>
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
                        <Tab label="Member" value="1" />
                        <Tab label="Music" value="2" />
                        <Tab label="Report" value="3" />
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
                                    <LineChart data={data}/>
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
                                    <FunnelChart/>
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
                                    <LineChart data={formdReport}/>
                                </div>   
                            </Box>
                        </Grid>
                    </TabPanel>
                </TabContext>
            </Box>
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