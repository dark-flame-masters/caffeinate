import { Link } from "react-router-dom";
import '../styling/TopBar.css';
import axios from "axios";
import * as Constants from '../constants'

export default function TopBar(props) {
  const {setUser, navigate } = props;

  const signOut = () => {
    console.log("hi");
    sessionStorage.clear();
    setUser(null);
    navigate('/');
    // axios({
    //     url: Constants.GRAPHQL_ENDPOINT,
    //     method: "post",
    //     headers: Constants.HEADERS,
    //     data: { "operationName": "login",
    //             "query": 
    //                 `mutation login($username: String!, $password: String!){
    //                     login(loginUserInput: { username: $username, password: $password }){
    //                         user {
    //                             username
    //                             treeStatus
    //                             treeDate
    //                         }
    //                     }
    //                 }`,
    //             "variables": {username, password},}
    // })
    // .then(res => {
    //   console.log("hi");
    //   sessionStorage.clear();
    //   setUser(null);
    //   navigate('/');
    // })
    // .catch(error => {
    //     alert("Error signing out");
    // });
  };

  return (
    <div className="topbar-full">
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
