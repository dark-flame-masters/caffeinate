import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styling/HomePage.css'

export default function HomePage(props) {
    const { user } = props;
    const navigate = useNavigate();
    const [greeting, setGreeting] = useState('');
    
    const nav = (page) => {
        if (page === 1) {
            navigate('/journal');
        } else if (page === 2) {
            navigate('/surveys');
        } else {
            navigate('/tree');
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
                <h1 className="greeting-message">{greeting}<span className="username">{user}</span></h1>
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
                        <h2 className="section-text">My Surveys</h2>
                    </div>
                    <div className="nav_text_generic">
                        <h2 className="section-slogan">Complete your daily check-in.</h2>
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
            </div>
        </div>
    );
};