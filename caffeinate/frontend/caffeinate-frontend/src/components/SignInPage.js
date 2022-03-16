import { useState, useRef, useEffect } from 'react';
import "../styling/SignInPage.css"
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import styled from "styled-components";
import axios from "axios";


const StyledTextField = styled(TextField)`
    label.focused {
        color: #D7B19D;
    }
    .MuiOutlinedInput-root {
        fieldset {
            border-color: #D7B19D;
        }
        &:hover fieldset {
            border-color: #D7B19D;
        }
        &.Mui-focused fieldset {
            border-color: #483434;
        }     
    }
`;

export default function SignInPage(props) {
    const { user, setUser, navigate } = props;
    const [option, setOption] = useState(1);
    const UsernameRef = useRef(null);
    const PassRef = useRef(null);

    useEffect(() => {
        console.log(user);
        if (user) {
            navigate('/');
        }
    }, [JSON.stringify(user)]);

    const signUpUser = (username, password) => {
        axios.post('http://localhost:3000/api/signup/', {username: username, password: password})
        .then(res => {
            console.log(res.data);
            sessionStorage.setItem('user', res.data.username);
            setUser(res.data.username);
        })
        .catch(error => {
          console.log(error.response);
        });
    
    };

    const signInUser = (username, password, onetime='') => {
        axios.post('http://localhost:3000/api/signin/', {username: username, password: password})
        .then(res => {
            console.log(res.data);
            sessionStorage.setItem('user', username);
            setUser(username);

        })
        .catch(error => {
          console.log(error.response);
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const username = UsernameRef.current.value;
        const password = PassRef.current.value;
        if (option) {
            signInUser(username, password);
  
        } else {
            signUpUser(username, password)
        }
    };

    const theme = createTheme({
        typography: {
            fontFamily: 'Noto',
            fontSize: 16,
            button: {
                textTransform: 'none',
                fontSize: 20,
                fontWeight: 600,
            }
        },
        palette: {
            borderColor: '#D7B19D',
            test: {
                light: '#D7B19D',
                main: '#EED6C4',
                dark: '#D7B19D',
                contrastText: '#483434',
            },
        },
    });

    return (
        <div id="signin-page">   
            <div className="entry-page">
                <div className="entry-page_logo">
                    <h1 id="logo"><span className="logo-special">Caffeine</span> for the mind and soul</h1>
                </div>

                <div className="form-section">
                    <h3 className="form-message">Sign in to <span className="name">Caffeinate</span></h3>
                    <ThemeProvider theme={theme}>
                        <form className="entry-page_form" onSubmit={handleSubmit}>
                            <StyledTextField sx={{ my: "1em" }} className="TextField" id="outlined-basic" label="Username" variant="outlined" inputRef={UsernameRef} required/>                                <a className="forgot-password-message">Forgot password?</a>
                            <StyledTextField sx={{ mb: "5em" }} className="TextField" id="outlined-basic" label="Password" variant="outlined" inputRef={PassRef} required/>
                            <Button id="signin" color="test" className="Button" type="submit" onClick={(e) => setOption(1)} variant="contained" disableElevation>Sign in</Button>
                            or
                            <Button id="signup" color="test" className="Button" type="submit" onClick={(e) => setOption(0)} variant="outlined" disableElevation>Sign up</Button>
                        </form>
                    </ThemeProvider>
                </div>
            </div>
        </div>
    );
};