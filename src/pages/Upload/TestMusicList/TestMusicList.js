
import { useState, useRef, useEffect, useContext } from "react"
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from "axios";
import { MusicContext } from "../../../App";

const TestMusicList = () => {

    const MusicSetting = useContext(MusicContext);

    // 데이터베이스에 음원목록을 가져오는 변수
    const [tracks, setTracks] = useState([]);


    // 데이터베이스에 존재하는 모든 음원 정보를 가져오는 기능
    const handlelist = () => {
        axios.get("/api/track").then(resp => {
            console.log(resp.data);
            setTracks(resp.data)
        })
    }

    return (
        <div>
            sdsdsds
        </div>
    );

}

export default TestMusicList;
