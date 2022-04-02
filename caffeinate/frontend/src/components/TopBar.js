import { Link } from "react-router-dom";
import { useState } from "react";
import '../styling/TopBar.css';
import axios from "axios";
import * as Constants from '../constants';
import ErrorMessage from './ErrorMessage';
import React from 'react';
import { GoogleLogout } from 'react-google-login';


export default function TopBar(props) {
  const {user, setUser, navigate } = props;
  const [error, setError] = useState('');

  const setFailure = () => {
    setError("There was a problem signing out.");
  }

  const signOut = () => {
    axios({
        url: Constants.GRAPHQL_ENDPOINT,
        method: "post",
        headers: {...Constants.HEADERS, Authorization: user},
        data: { "operationName": "logout",
                "query": 
                    `mutation logout {
                      logout
                    }`,
              }
    })
    .then(res => {
      setUser(null);
      navigate('/');
    })
    .catch(error => {
      setError("There was a problem signing out.");
    });
  };

  return (
    <div className="topbar-full">
      {error.length ? <ErrorMessage error={error} setError={setError} /> : ''}
      <div className="appname">
        <Link className="brand" to="/credits">Caffeinate</Link>
      </div>
      <div className="topbar">
          <div className="topbar_button">
              <Link className="link" to="/">Home</Link>
          </div>
          <div className="topbar_button">
              <Link className="link" to="/analytics">Analytics</Link>
          </div>
          <div className="topbar_button" id="signout">
          <GoogleLogout
            clientId={`${process.env.REACT_APP_CLIENT_ID}`}
            render={(prop) => (
              <button className="link" onClick={prop.onClick} disabled={prop.disabled}>
                Sign out
              </button>
            )}
            onLogoutSuccess={signOut}
            onLogoutFailure={setFailure}
            cookiePolicy={"single_host_origin"}
          />
          </div>
      </div>
    </div>
  );
};
