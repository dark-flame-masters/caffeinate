import { Link } from "react-router-dom";
import { useState } from "react";
import '../styling/TopBar.css';
import axios from "axios";
import * as Constants from '../constants';
import ErrorMessage from './ErrorMessage';
import React from 'react';

export default function TopBar(props) {
  const {user, setUser, navigate } = props;
  const [error, setError] = useState('');

  const signOut = () => {
    axios({
        url: Constants.GRAPHQL_ENDPOINT,
        method: "post",
        headers: Constants.HEADERS,
        data: { "operationName": "logout",
                "query": 
                    `mutation logout($input: String!){
                      logout(input: $input)
                    }`,
                "variables": {'input': user},
              }
    })
    .then(res => {
      sessionStorage.clear();
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
              <button onClick={signOut} className="link">Sign out</button>
          </div>
      </div>
    </div>
  );
};
