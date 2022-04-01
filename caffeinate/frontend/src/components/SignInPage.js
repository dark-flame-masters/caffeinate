import { useState, useRef, useEffect } from 'react';
import React from 'react';
import "../styling/SignInPage.css"
import axios from "axios";
import * as Constants from '../constants';
import ErrorMessage from './ErrorMessage';
import GoogleLogin from "react-google-login";

export default function SignInPage(props) {
    const { user, setUser, navigate } = props;
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
            headers: {...Constants.HEADERS, Authorization: res.tokenId},
            data: { "operationName": "login",
                    "query": `
                        mutation login {
                            user {
                                googleId
                                treeDate
                                treeStatus
                            }
                        }
                    `,
                }
            })
        .then(response => {
            console.log(response);
            if (response.data.data) {
                sessionStorage.setItem('user', res.tokenId);
                setUser(res.tokenId);
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
    }

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
                        theme='dark'
                    />
                </div>
            </div>
        </div>
    );
};