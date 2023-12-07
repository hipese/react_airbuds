import React from "react";
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import styles from "./Music.module.css";
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

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

const MusicWithTabs = () => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Grid container>
            <Grid item className={styles.user_info}>
                <Avatar alt="Remy Sharp" sx={{ width: 200, height: 200, marginLeft: 2 }} />
            </Grid>
            <Grid item xs={12} md={9}>
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example"
                            TabIndicatorProps={{
                                style: { backgroundColor: '#4CAF50' }  // 선택된 탭의 라벨 밑에 있는 줄의 색상
                            }}
                        >
                            <Tab label="ALL" {...a11yProps(0)}
                                sx={{
                                    '&.Mui-selected': {
                                        color: '#4CAF50',  // 선택된 상태일 때의 라벨 색상
                                    },
                                }} />
                            <Tab label="Tracks" {...a11yProps(1)} />
                            <Tab label="Albums" {...a11yProps(2)} />
                            <Tab label="Playlists" {...a11yProps(3)} />
                        </Tabs>
                    </Box>
                    <CustomTabPanel value={value} index={0}>
                        ALL
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={1}>
                        Tracks
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={2}>
                        Albums
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={3}>
                        Playlists
                    </CustomTabPanel>
                </Box>
            </Grid>
            <Grid item xs={12} md={3}>Followers</Grid>
        </Grid>
    );
}

export default MusicWithTabs;
