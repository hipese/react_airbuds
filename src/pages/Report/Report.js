import React from "react";
import { Routes, Route, useNavigate } from 'react-router-dom';
import ReportList from "./ReportList";
import ReportDetail from "./ReportDetail";
import Sanction from "./Sanction/Sanction";
import SanctionList from "./Sanction/SanctionList";
import style from './Report.module.css'
import { Box, Button, Divider, Drawer, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Tab, Tooltip, Typography } from "@mui/material";
const Report = () => {
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

  const handleDrawerClick = (e, i) => {
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
          <ListItemButton value="신고">
            <ListItemText primary="" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText primary="" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={(event) => { handleDrawerClick(event, "/report") }}>
            <ListItemText primary="신고 목록" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={(event) => { handleDrawerClick(event, "/report/sanction") }}>
            <ListItemText primary="제재 관리" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={(event) => { handleDrawerClick(event, "/report/sanctionList") }}>
            <ListItemText primary="제재 목록" />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
    </Box>
  );

  return (
    <div className={`${style.reportcontainer} ${style.ma}`}>
      <div id="title" className={`${style.pad10}`}>
        <Typography fontSize={13}>
          신고   <Button onClick={toggleDrawer('left', true)}>Menu</Button>
        </Typography>
        <Drawer
          anchor={'left'}
          open={state['left']}
          onClose={toggleDrawer('left', false)}
        >
          {list('left')}
        </Drawer>
      </div>
      <Routes>
        <Route path="/" element={<ReportList />} />
        <Route path="/detail/:seq" element={<ReportDetail />} />
        <Route path="/sanction" element={<Sanction />} />
        <Route path="/sanctionList" element={<SanctionList />} />
      </Routes>
    </div>
  );
};

export default Report;