import React from "react";
import { useAuth } from "../auth/useAuth";

const dashboardStyle = {
  padding: "2rem",
};

const UserDashboard = () => {
  const { user } = useAuth();

  return (
    <div style={dashboardStyle}>
      <h1>Welcome, {user?.full_name}!</h1>
      <p>This is your dashboard. You are logged in as a regular user.</p>
    </div>
  );
};

export default UserDashboard;