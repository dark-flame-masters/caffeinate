import React, { useState } from "react";
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

export default function App() {
  const [user, setUser] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

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
              <Route exact path="*" element={<HomePage user={user} name={name} navigate={navigate}/>}/>
              <Route path="journal" element={<JournalPage user={user}/>}/>
              <Route path="surveys" element={<SurveyPage user={user}/>}/>
              <Route path="tree" element={<TreePage user={user}/>}/>
              <Route path="analytics" element={<AnalyticsPage user={user}/>}/>
              <Route path="agenda" element={<AgendaPage user={user} name={name}/>}/>
              <Route path="signin" element={<Navigate to="/" replace={true}/>}/>
              <Route path="credits" element={<CreditsPage/>}/>
            </Routes>
          </div>
        )}
    </div>
  )
};
