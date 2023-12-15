import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Track_Upload from './Track_Upload/Track_Upload';
import TestMusicList from './TestMusicList/TestMusicList';
import { Link, Route, Routes } from 'react-router-dom';
import YourTracks from './YourTracks/YourTracks';


function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function Upload_Main() {
  const [value, setValue] = React.useState(0);
  
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="upload" component={Link} to="" {...a11yProps(0)} />
          <Tab label="yourtracks" component={Link} to="yourtracks" {...a11yProps(1)} />
          <Tab label="myAlbums" component={Link} to="myAlbums" {...a11yProps(2)}  />
        </Tabs>
      </Box>
      <Routes>
        <Route path="/" element={<Track_Upload />} />
        <Route path="/yourtracks" element={<YourTracks/>} />
        <Route path="/myAlbums" element={<YourTracks/>} />
      </Routes>
    </Box>
  );
}