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
        })
        .catch(error => {
            console.log(error);
        }); 
    };

    return (
        <div id="signin-page">   
            {error.length ? <ErrorMessage error={error} setError={setError} /> : ''}
            <div className="entry-page">
                <div className="entry-page_logo">
                    <h1 id="logo"><span className="logo-special">Caffeine</span> for the mind and soul</h1>
                </div>

                <div className="form-section">
                    <h3 className="form-message">Sign up or sign in to <span className="name">Caffeinate</span></h3>
                    <GoogleLogin
                        clientId={`${process.env.REACT_APP_CLIENT_ID}`}
                        onSuccess={(r) => onSuccess(r)}
                    />
                </div>
            </div>
        </div>
    );
};