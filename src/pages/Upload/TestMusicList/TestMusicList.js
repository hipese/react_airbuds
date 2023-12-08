
import { useState, useRef, useEffect, useContext } from "react"
import axios from "axios";

const TestMusicList = () => {

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

    useEffect(() => {
        axios.get(`/api/track/bywriter/${testText}`).then(resp => {
            const tracksWithImages = resp.data.map(track => {
                // trackImages 배열이 비어있지 않은 경우, 첫 번째 이미지의 경로를 추출
                const imagePath = track.trackImages.length > 0 ? track.trackImages[0].imagePath : null;
                return { ...track, imagePath };
            });

            console.log("Tracks with images:", tracksWithImages);
            setTracks(tracksWithImages);
        });
    }, []);

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
                    {track.title}
                    <br />
                    <img
                        src={track.imagePath ? `/tracks/image/${track.imagePath}` : '/assets/groovy2.png'}
                        alt={track.title}
                    />
                    <br />
                    <button onClick={() => handleDelete(track.trackId)}>삭제하기</button>
                </div>
            ))}
        </div>
    );

}

export default TestMusicList;
