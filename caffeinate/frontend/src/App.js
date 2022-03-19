import React, { useState, useEffect } from "react";
import SignInPage from './components/SignInPage';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import JournalPage from "./components/JournalPage";
import SurveyPage from "./components/SurveyPage";
import TreePage from "./components/TreePage";
import HomePage from "./components/HomePage";
import TopBar from "./components/TopBar";
import CreditsPage from "./components/CreditsPage";
import AnalyticsPage from "./components/AnalyticsPage";

export default function App() {
  const [user, setUser] = useState(sessionStorage.getItem('user'));
  const navigate = useNavigate();

  return (
    <div>
        {!user ? 
          (<Routes>  
            <Route path="*" element={<Navigate to="signin" replace={true}/>}/>
            <Route path="signin" element={<SignInPage user={user} setUser={setUser} navigate={navigate} />}/>
          </Routes> 
        ) : ( 
          <div>
            <TopBar setUser={setUser} navigate={navigate} />
            <Routes>
              <Route exact path="*" element={<HomePage user={user} navigate={navigate}/>}/>
              <Route path="journal" element={<JournalPage/>}/>
              <Route path="surveys" element={<SurveyPage/>}/>
              <Route path="tree" element={<TreePage/>}/>
              <Route path="analytics" element={<AnalyticsPage/>}/>
              <Route path="signin" element={<Navigate to="/" replace={true}/>}/>
              <Route path="credits" element={<CreditsPage/>}/>
            </Routes>
          </div>
        )}
    </div>
  )
};
