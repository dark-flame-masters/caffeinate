import { Link } from "react-router-dom";
import '../styling/TopBar.css';

export default function TopBar() {
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
              <Link className="link" to="/signout">Sign out</Link>
          </div>
      </div>
    </div>
  );
};
