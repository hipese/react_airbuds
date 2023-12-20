import { Button } from "reactstrap";
import styles from "./MyAlbums.module.css"
import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom"
import RightSide from "../../Main/RightSide/RightSide";
import { LoginContext } from "../../../App";
import { Box, CircularProgress } from "@mui/material";
import AlbumsCarousel from "./AlbumsCarousel/AlbumsCarousel"

const MyAlbums = () => {

   
    const [selectTitle, setSelectTitle] = useState([]);
   
    const { loginID, setLoginID } = useContext(LoginContext);
    const storageId = localStorage.getItem("loginID");
    const [isFavorite, setFavorite] = useState(0);
    const [loading, setLoading] = useState(true);
   
    const [myAlbumsInfo,setMyAlbumsInfo]=useState([]);
    
    useEffect(() => {
        axios.get(`/api/album/findByLogin`).then(resp=>{
            console.log(resp.data)
            setMyAlbumsInfo(resp.data);
            setLoading(false); 
        })
       
    }, [loginID]);


    // const CircularIndeterminate = () => {
    //     return (
    //         <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    //             <CircularProgress />
    //         </Box>
    //     );
    // };

    // if (loading) {
    //     return <CircularIndeterminate />;
    // }

    return (
        <div className={styles.container}>
            <div className={styles.contentContainer}>
                <div className={styles.leftSide}>
                    
                    <div className={styles.carouselTitle}>내 앨범목록</div>
                    <div className={styles.carousel}>
                        <AlbumsCarousel myAlbumsInfo={myAlbumsInfo}/>
                    </div>
                    

                    <div className={styles.leftBottom}></div>
                </div>
               
            </div>
        </div>
    );
}

export default MyAlbums;
