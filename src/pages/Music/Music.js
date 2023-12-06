import react from "react";
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import styles from "./Music.module.css";
import { Grid } from "@mui/material";

const Music = () => {
    return (
        <Grid container>
            <Grid item className={styles.user_info}>
                <Avatar alt="Remy Sharp" sx={{ width: 200, height: 200, marginLeft: 2 }}/>
            </Grid>
        </Grid>
    );
}

export default Music;