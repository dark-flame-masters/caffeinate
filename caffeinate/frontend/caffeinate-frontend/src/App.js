import React, { useState } from "react";
import SignInPage from './components/SignInPage';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import JournalPage from "./components/JournalPage";
import SurveyPage from "./components/SurveyPage";
import TreePage from "./components/TreePage";
import HomePage from "./components/HomePage";
import TopBar from "./components/TopBar";
import CreditsPage from "./components/CreditsPage";
import AnalyticsPage from "./components/AnalyticsPage";

export default function App() {
  const [token, setToken] = useState('');
  console.log(token);
  
  return (
    <div>
      <BrowserRouter>
        {!token ? 
          <Routes>  
            <Route path="/" element={<Navigate to="/signin" replace={true}/>}/>
          </Routes> 
        : ( 
          <div>
            <TopBar />
            <Routes>
              <Route exact path="/" element={<HomePage user={'Username'}/>}></Route>
              <Route path="/journal" element={<JournalPage/>}></Route>
              <Route path="/surveys" element={<SurveyPage/>}></Route>
              <Route path="/tree" element={<TreePage/>}></Route>
              <Route path="/analytics" element={<AnalyticsPage/>}></Route>
            </Routes>
          </div>
        )}
          <Routes>
            <Route path="/signin" element={<SignInPage token={token} setToken={setToken}/>}></Route>
            <Route path="/credits" element={<CreditsPage/>}></Route>
          </Routes>
      </BrowserRouter>

    </div>
  )
};
