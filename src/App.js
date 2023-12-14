import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Groovy from "./pages/Groovy/Groovy";
import { createContext, useEffect, useState } from "react";
import { CookiesProvider } from "react-cookie";
import axios from 'axios';


export const LoginContext = createContext();
export const MusicContext = createContext();
export const PlayingContext = createContext();
export const CurrentTrackContext = createContext();
export const TrackInfoContext = createContext();
export const TrackContext = createContext();
export const AutoPlayContext = createContext();
function App() {
  const [loginID, setLoginID] = useState("");
  const [audioFiles, setAudioFiles] = useState([
    // 'https://raw.githubusercontent.com/himalayasingh/music-player-1/master/music/2.mp3',
    // 'https://raw.githubusercontent.com/himalayasingh/music-player-1/master/music/3.mp3',
    // 'https://raw.githubusercontent.com/himalayasingh/music-player-1/master/music/4.mp3',
    // 'https://raw.githubusercontent.com/himalayasingh/music-player-1/master/music/5.mp3',
    // // Add more audio URLs as needed
  ]);
  const [track_info, setTrack_info] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [tracks, setTracks] = useState([]);
  const [autoPlayAfterSrcChange, setAutoPlayAfterSrcChange] = useState(false);

  useEffect(() => {
    axios.get("/api/member/isLogined").then(resp => {
      setLoginID(resp.data);
    }).catch(() => { })
  }, [])

  return (
    <Router>
      <LoginContext.Provider value={{ loginID, setLoginID }}>
        <MusicContext.Provider value={{ audioFiles, setAudioFiles }}>
          <CurrentTrackContext.Provider value={{ currentTrack, setCurrentTrack }}>
            <PlayingContext.Provider value={{ isPlaying, setIsPlaying }}>
              <TrackInfoContext.Provider value={{ track_info, setTrack_info }}>
                <TrackContext.Provider value={{ tracks, setTracks }}>
                  <AutoPlayContext.Provider value={{ autoPlayAfterSrcChange, setAutoPlayAfterSrcChange }}>
                    <CookiesProvider>
                      <Routes>
                        <Route path="/*" element={<Groovy />} />
                      </Routes>
                    </CookiesProvider>
                  </AutoPlayContext.Provider>
                </TrackContext.Provider>
              </TrackInfoContext.Provider>
            </PlayingContext.Provider>
          </CurrentTrackContext.Provider>
        </MusicContext.Provider>
      </LoginContext.Provider>
    </Router>
  );
}

export default App;