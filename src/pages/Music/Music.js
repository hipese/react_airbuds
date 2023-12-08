import React from "react";
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import styles from "./Music.module.css";
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/system';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import None_track_info from "../Components/None_track_info";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

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

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const MusicWithTabs = () => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Grid container>
            <Grid item className={styles.user_info}>
                <Grid item md={2}>
                    <Avatar alt="Remy Sharp" sx={{ width: 180, height: 180, marginLeft: 2 }} />
                </Grid>
                <Grid item md={7}>
                    <Typography variant="h2" gutterBottom>
                        Groovy
                    </Typography>
                    <Typography variant="h5" gutterBottom>
                        &nbsp;'s Groovy Space
                    </Typography>
                </Grid>
                <Grid item md={3}>
                    <InputFileUpload />
                </Grid>
            </Grid>
            <Grid item xs={12} md={9} className={styles.Panel}>
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
                            <div className={styles.like_edit}>
                            <FavoriteBorderIcon/>
                            <Button variant="outlined" startIcon={<ModeEditIcon />}
                                sx={{
                                    width: '100px',
                                    height: '30px',
                                    color: '#212529',
                                    borderColor: '#4CAF50',
                                    marginTop: '10px',
                                    marginBottom: '10px', 
                                    '&:hover': {
                                        borderColor: '#4CAF50',
                                        backgroundColor: '#4CAF50',
                                    },
                                }}>
                                Edit
                            </Button>
                            </div>
                        </Tabs>
                    </Box>
                    <CustomTabPanel value={value} index={0}>
                        <None_track_info />
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={1}>
                        <None_track_info />
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={2}>
                        <None_track_info />
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={3}>
                        <None_track_info />
                    </CustomTabPanel>
                </Box>
            </Grid>
            <Grid item xs={12} md={3}>
                <div className={styles.followersInfo}>
                    <div className={styles.infoItem}>
                        <Typography variant="h6" gutterBottom>
                            Followers<br></br>
                            100
                        </Typography>
                    </div>
                    <div className={styles.infoItem}>
                        <Typography variant="h6" gutterBottom>
                            Following<br></br>
                            50
                        </Typography>
                    </div>
                    <div className={styles.infoItemLast}>
                        <Typography variant="h6" gutterBottom>
                            Tracks<br></br>
                            30
                        </Typography>
                    </div>
                </div>
                <div className={styles.myreply}>
                    나의 최근 댓글

                </div>
            </Grid>
        </Grid>
    );
}

const InputFileUpload = () => {
    return (
        <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
            Upload file
            <VisuallyHiddenInput type="file" />
        </Button>
    );
}

export default MusicWithTabs;
