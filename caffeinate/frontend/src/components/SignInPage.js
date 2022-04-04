import { useState, useEffect } from 'react';
import React from 'react';
import "../styling/SignInPage.css"
import axios from "axios";
import * as Constants from '../constants';
import ErrorMessage from './ErrorMessage';
import GoogleLogin from "react-google-login";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';

export default function SignInPage(props) {
    const { user, setUser, setName, navigate } = props;
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            return navigate('/');
        }
    }, [JSON.stringify(user)]);

    const onSuccess = (res) => {
        console.log(res)
        axios({
            url: Constants.GRAPHQL_ENDPOINT,
            method: "post",
            headers: {...Constants.HEADERS, Authorization: res.accessToken},
            data: { "operationName": "login",
                    "query": `
                        mutation login {
                            login {
                                user {
                                    googleId
                                }
                            }
                        }
                    `,
                }
            })
        .then(response => {
            if (response.data.data) {
                setUser(res.accessToken);
                setName(res.profileObj.name);
            } else {
                setError("Something went wrong when signing in. Please try again later.");
            }
        })
        .catch(error => {
            setError("Something went wrong when signing in. Please try again later.");
        }); 
    };

    const showFailure = () => {
        setError("Something went wrong when signing in with Google. Please try again later.");
    };
        
    const theme = createTheme({
        typography: {
            fontFamily: 'Noto',
            fontSize: 16,
            button: {
                textTransform: 'none',
                fontSize: 20,
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
            {error.length ? <ErrorMessage error={error} setError={setError} /> : ''}
            <div className="entry-page">
                <div className="entry-page_logo">
                    <h1 id="logo"><span className="logo-special">Caffeine</span> for the mind and soul</h1>
                </div>

                <div className="form-section">
                    <h3 className="form-message">Sign in to <span className="name">Caffeinate</span></h3>
                    <GoogleLogin
                        clientId={`${process.env.REACT_APP_CLIENT_ID}`}
                        buttonText="Sign in with Google"
                        onSuccess={(r) => onSuccess(r)}
                        onFailure={showFailure}
                        render={(prop) => (
                            <ThemeProvider theme={theme}> 
                                <Button id="signin" onClick={prop.onClick} disabled={prop.disabled} color="test" className="Button" variant="contained" disableElevation>Proceed via Google</Button>
                            </ThemeProvider>
                        )}
                        cookiePolicy={"single_host_origin"}
                        isSignedIn
                    />
                </div>
            </div>
        </div>
    );
};