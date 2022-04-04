import { useEffect, useState } from "react";
import '../styling/HomePage.css';
import React from 'react';

export default function HomePage(props) {
    const { name, navigate } = props;
    const [greeting, setGreeting] = useState('');
    
    const nav = (page) => {
        if (page === 1) {
            navigate('/journal');
        } else if (page === 2) {
            navigate('/surveys');
        } else if (page === 3) {
            navigate('/tree');
        } else {
            navigate('/agenda');
        }
    };
    
    useEffect(() => {
        let hours = new Date().getHours();
        const greetings = ['Good morning, ', 'Good afternoon, ', 'Good evening, '];
        if (hours <= 11) {
            setGreeting(greetings[0]);
        } else if (hours <= 18) {
            setGreeting(greetings[1]);
        } else {
            setGreeting(greetings[2]);
        }
    }, [greeting]);
    
    return (
        <div className="homepage">
            <div className="greeting-section">
                <h1 className="greeting-message">{greeting}<span className="username">{name}</span></h1>
                <h3 className="greeting-message_generic">What are you up to?</h3>
            </div>

            <div className="navigation-section">
                <div className="nav" onClick={() => nav(1)}>
                    <div className="nav_text">
                        <h2 className="section-text">My Journal</h2>
                    </div>
                    <div className="nav_text_generic">
                        <h2 className="section-slogan">How are you feeling today?</h2>
                    </div>
                </div>

                <div className="nav" onClick={() => nav(2)}>
                    <div className="nav_text">
                        <h2 className="section-text">Daily Survey</h2>
                    </div>
                    <div className="nav_text_generic">
                        <h2 className="section-slogan" id="survey-slogan">Complete your daily wellness check-in.</h2>
                    </div>
                </div>

                <div className="nav" onClick={() => nav(3)}>
                    <div className="nav_text">
                        <h2 className="section-text">My Tree</h2>
                    </div>
                    <div className="nav_text_generic">
                        <h2 className="section-slogan">Check how your tree is growing.</h2>
                    </div>
                </div>

                <div className="nav" onClick={() => nav(4)}>
                    <div className="nav_text">
                        <h2 className="section-text">My Agenda</h2>
                    </div>
                    <div className="nav_text_generic">
                        <h2 className="section-slogan">What do you need to do today?</h2>
                    </div>
                </div>
            </div>
        </div>
    );
};