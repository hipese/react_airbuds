import { Button } from "reactstrap";
import style from "./MyAlbums.module.css"
import axios from "axios";
import { useState } from "react";

const MyAlbums = () => {

    const [albums, setAlbums] = useState([]);

    // 앨범 불러오는 기능
    const handleAlbum = () => {
        axios.get("/api/album/findByLogin").then(resp => {
            console.log(resp.data);
            setAlbums(resp.data);
        })
    }

    return (
        <div>
            <Button onClick={handleAlbum}>앨범 불러오기</Button>
            <div>
                {albums.map((album, index) => (
                    <div key={index}>
                        <h3>{album.title}</h3>
                        <p>By {album.artistId}</p>
                        <p>Released on {album.releaseDate}</p>
                        <img src={"/tracks/image/" + album.coverImagePath} alt={album.title} style={{ width: '100px' }} />
                        <h4>Tracks</h4>
                        {album.tracks.map((track, trackIndex) => (
                            <div key={trackIndex}>
                                <p>{track.title}</p>
                                <p>Duration: {track.duration}</p>
                                <hr />
                            </div>
                        ))}
                        <hr />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MyAlbums;
