
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

    const testText = "잉여";

    // 데이터베이스에 존재하는 모든 음원 정보를 가져오는 기능
    const handlelist = () => {
        axios.get(`/api/track/bywriter/${testText}`).then(resp => {
            setTracks(resp.data);
            console.log(resp.data);
        })
    }

    // 선택한 id값의 음원 정보를 삭제하는 기능
    const handleDelete = (trackId) => {
        console.log("뭐임" + trackId);
        axios.delete(`/api/track/${trackId}`).then(resp => {
            console.log("삭제 성공..")
        }).catch(resp => {
            console.log("삭제 실패...")
        })
    }

    return (
        <div>
            {tracks.map((track, index) => (
                <div key={index}>
                    {track.title} <button onClick={() => handleDelete(track.trackId)}>삭제하기</button>
                </div>
            ))}

            <button onClick={handlelist}>목록 보여주기</button>
        </div>
    );

}

export default TestMusicList;
