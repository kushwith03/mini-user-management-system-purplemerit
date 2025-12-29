import React from "react";
import { useAuth } from "../auth/AuthContext";
import Card from "../components/Card";

const UserDashboard = () => {
  const { user } = useAuth();

  return (
    <div style={{ maxWidth: '800px', margin: 'auto' }}>
      <Card>
        <div style={{ textAlign: 'center' }}>
          <h1>Welcome, {user?.full_name}!</h1>
          <p>You are logged in as a '{user?.role}'.</p>
          {user?.status === 'inactive' && (
            <div style={{ 
              marginTop: '1.5rem', 
              padding: '1rem', 
              backgroundColor: 'var(--warning-color)', 
              color: 'white', 
              borderRadius: 'var(--border-radius)' 
            }}>
              Your account is currently inactive. Please contact an administrator.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default UserDashboard;
