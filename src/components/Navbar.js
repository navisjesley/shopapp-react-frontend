import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, appUserId, appUserName, isBootstrappingUser, login, logout } = useAuth();

  return (
    <nav className="navbar">

      <div className="navbar-title">Shop App</div>

      <div className="navbar-right">
        <Link to="/" className="nav-link">Home</Link>

        {user ? (
          <>
            <span>
              {isBootstrappingUser
                ? "Profile Loading..."
                : `Welcome ${appUserName || "User"}`}
            </span>

            {!isBootstrappingUser && appUserId && <Link to="/cart" className="nav-link">Cart</Link>}

            <button className="nav-button" onClick={logout}>Logout</button>
          </>
        ) : (
          <button className="nav-button" onClick={login}>Login / Sign Up</button>
        )}
      </div>
    </nav>
  );
}