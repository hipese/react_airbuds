import React, { useContext, useEffect, useState } from 'react';
import styles from "./Following.module.css";
import axios from "axios";
import { LoginContext } from '../../../App';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { Link } from 'react-router-dom';
import None_login_info from '../../Components/None_login_info';
import { Avatar, Box, CircularProgress, Grid, Typography } from '@mui/material';

const LoadingSpinner = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
    <CircularProgress color="inherit" />
  </Box>
);

const Following = () => {
  const [loading, setLoading] = useState(true);
  const { loginID, setLoginID } = useContext(LoginContext);
  const [artist, setArtist] = useState([]);

  useEffect(() => {
    if (!loginID) {
      setLoading(false);
      return;
    }

    axios.get(`/api/like/follwingData/${loginID}`).then(res => {
      console.log(res.data);
      const sortedData = res.data.sort((a, b) => b.followerNumber - a.followerNumber);
      setArtist(sortedData);
    }).catch((e) => {
      console.log(e);
    });
  }, [loginID !== ""]);

  const usersInRows = artist.reduce((rows, user, index) => {
    if (index % 5 === 0) {
      rows.push([]);
    }
    rows[rows.length - 1].push(user);
    return rows;
  }, []);

  return (
    <>
      {loginID ? (
        <Grid container className={styles.followingContainer} spacing={2}>
          <Grid item xs={12} className={styles.title}>
            <Typography variant="h4">팔로우한 사용자</Typography>
          </Grid>

          {usersInRows.map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              {row.map((user, userIndex) => (
                <Grid key={user.userId} item xs={12} sm={6} md={4} lg={3} xl={2} className={styles.userInfo}>
                  <Link className={styles.linkurl} to={`/Profile/${user.singer}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Avatar src={user.profile_image} alt={user.singer} sx={{ width: '200px', height: '200px', margin: 'auto', marginTop: '10px' }} />
                    <Typography variant="h4">{user.singer}</Typography>
                    <Typography variant="body1">{user.followerNumber} followers</Typography>
                  </Link>
                </Grid>
              ))}
              <Grid item xs={12} style={{ clear: 'both' }} />
            </React.Fragment>
          ))}
        </Grid>
      ) : (
        <div className={styles.noneLogin}>
          <None_login_info />
        </div>
      )}
    </>
  );
};

export default Following;

