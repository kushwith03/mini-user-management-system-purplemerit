import React, { useState, useEffect } from "react";
import * as adminApi from "../api/admin";

const dashboardStyle = {
  padding: "2rem",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "2rem",
};

const thTdStyle = {
  border: "1px solid #ccc",
  padding: "0.5rem",
  textAlign: "left",
};

const buttonStyle = {
  marginRight: "0.5rem",
  cursor: "pointer",
};

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await adminApi.getAllUsers();
      setUsers(response.data.users);
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to fetch users.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId, action) => {
    try {
        if (action === 'activate') {
            await adminApi.activateUser(userId);
        } else {
            await adminApi.deactivateUser(userId);
        }
        fetchUsers(); // Refresh the list after action
    } catch (err) {
        const message =
        err.response?.data?.message || `Failed to ${action} user.`;
      alert(message);
    }
  };

  if (loading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  return (
    <div style={dashboardStyle}>
      <h1>Admin Dashboard</h1>
      <p>Manage users below.</p>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thTdStyle}>Full Name</th>
            <th style={thTdStyle}>Email</th>
            <th style={thTdStyle}>Role</th>
            <th style={thTdStyle}>Status</th>
            <th style={thTdStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td style={thTdStyle}>{user.full_name}</td>
              <td style={thTdStyle}>{user.email}</td>
              <td style={thTdStyle}>{user.role}</td>
              <td style={thTdStyle}>{user.status}</td>
              <td style={thTdStyle}>
                {user.status === "active" ? (
                  <button onClick={() => handleStatusChange(user.id, 'deactivate')} style={buttonStyle}>
                    Deactivate
                  </button>
                ) : (
                  <button onClick={() => handleStatusChange(user.id, 'activate')} style={buttonStyle}>
                    Activate
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;