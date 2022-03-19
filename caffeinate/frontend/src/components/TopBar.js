import { Link } from "react-router-dom";
import '../styling/TopBar.css';

export default function TopBar(props) {
  const {setUser, navigate } = props;

  const signOut = () => {
    console.log("hi");
    sessionStorage.clear();
    setUser(null);
    navigate('/');
  }

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
