import React, { useState } from "react";
import './styling/App.css';
import SignInPage from './components/SignInPage';
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import JournalPage from "./components/JournalPage";
import SurveyPage from "./components/SurveyPage";
import TreePage from "./components/TreePage";
import HomePage from "./components/HomePage";
import TopBar from "./components/TopBar";
import CreditsPage from "./components/CreditsPage";
import AnalyticsPage from "./components/AnalyticsPage";
import AgendaPage from "./components/AgendaPage";
import ReactHowler from 'react-howler';
import water from "./media/water.mp3";

export default function App() {
  const [user, setUser] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const [play, setPlay] = useState(false);
  
  // tutorial of ReactHowler from https://github.com/thangngoc89/react-howler/blob/master/examples/react/src/players/OnlyPlayPauseButton.js
  const controlSound = (setting) => {
    if (setting) {
      setPlay(true);
    } else {
      setPlay(false);
    }
  };

  return (
    <div>
        {!user ? 
          (<Routes>  
            <Route path="*" element={<Navigate to="signin" replace={true}/>}/>
            <Route path="signin" element={<SignInPage user={user} setUser={setUser} setName={setName} name={name} navigate={navigate} />}/>
          </Routes> 
        ) : ( 
          <div>
            <TopBar user={user} setUser={setUser} navigate={navigate} />
            
            <Routes>
              <Route exact path="*" element={<HomePage name={name} navigate={navigate}/>}/>
              <Route path="journal" element={<JournalPage user={user}/>}/>
              <Route path="surveys" element={<SurveyPage user={user}/>}/>
              <Route path="tree" element={<TreePage user={user}/>}/>
              <Route path="analytics" element={<AnalyticsPage user={user}/>}/>
              <Route path="agenda" element={<AgendaPage user={user} name={name}/>}/>
              <Route path="signin" element={<Navigate to="/" replace={true}/>}/>
              <Route path="credits" element={<CreditsPage/>}/>
            </Routes>
            
            <div className="background-sound">
                <ReactHowler
                  src={water}
                  playing={play}
                  loop
                />
                <div className="play" onClick={() => controlSound(1)}></div>
                <div className="pause" onClick={() => controlSound(0)}></div>
            </div>
          </div>
        )}
    </div>
  )
};
