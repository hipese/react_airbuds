import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Groovy from "./pages/Groovy/Groovy";
import { createContext, useState } from "react";
import { CookiesProvider } from "react-cookie";


export const LoginContext = createContext();
export const MusicContext = createContext();
function App() {
  const [loginID, setLoginID] = useState("");
  const [audioFiles, setAudioFiles] = useState([
    'https://raw.githubusercontent.com/himalayasingh/music-player-1/master/music/2.mp3',
    'https://raw.githubusercontent.com/himalayasingh/music-player-1/master/music/3.mp3',
    'https://raw.githubusercontent.com/himalayasingh/music-player-1/master/music/4.mp3',
    'https://raw.githubusercontent.com/himalayasingh/music-player-1/master/music/5.mp3',
    // Add more audio URLs as needed
  ]);

  return (
    <Router>
      <LoginContext.Provider value={{ loginID, setLoginID }}>
        <MusicContext.Provider value={{ audioFiles, setAudioFiles }}>
          <CookiesProvider>
            <Routes>
              <Route path="/*" element={<Groovy />} />
            </Routes>
          </CookiesProvider>
        </MusicContext.Provider>
      </LoginContext.Provider>
    </Router>
  );
}

export default App;
