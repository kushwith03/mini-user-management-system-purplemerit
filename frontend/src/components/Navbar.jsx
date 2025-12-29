import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

const navStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "1rem 2rem",
  backgroundColor: "#f0f0f0",
  borderBottom: "1px solid #ccc",
};

const linkContainerStyle = {
  display: "flex",
  gap: "1rem",
};

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav style={navStyle}>
      <div>
        <Link to="/">Home</Link>
      </div>
      <div style={linkContainerStyle}>
        {isAuthenticated ? (
          <>
            {user?.role === "admin" && (
              <Link to="/admin">Admin Dashboard</Link>
            )}
            <Link to="/profile">Profile</Link>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
