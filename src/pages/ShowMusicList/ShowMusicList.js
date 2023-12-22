
import { useEffect, useState } from "react";
import style from "./ShowMusicList.module.css"
import { useParams } from 'react-router-dom';
import axios from "axios";

const ShowMusicList=()=>{
    const { searchText } = useParams();

    const [search,setSearch] =useState();
    const [searchTracks,setSearchTracks]=useState([]);
    const [searchAlbums,setSearchAlbums]=useState([]);

    console.log(searchText);

    useEffect(()=>{

        console.log(searchText)
        
        axios.get(`/api/track/searchText/${searchText}`).then(resp=>{
            console.log(resp.data);
            setSearchTracks(resp.data);
            setSearch(searchText);
        })

        axios.get(`/api/album/searchText/${searchText}`).then(resp=>{
            console.log(resp.data);
            setSearchAlbums(resp.data);
            setSearch(searchText);
        })
    },[searchText])

    
    return(
        <div>
            오냐?
        </div>
    )
}

export default ShowMusicList;