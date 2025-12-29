import React, { useState, useEffect } from "react";
import * as userApi from "../api/user";
import { useAuth } from "../auth/useAuth";

const profileContainerStyle = {
  maxWidth: "600px",
  margin: "2rem auto",
  padding: "2rem",
  border: "1px solid #ccc",
  borderRadius: "8px",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
};

const inputGroupStyle = {
  display: "flex",
  flexDirection: "column",
};

const labelStyle = {
  marginBottom: "0.5rem",
};

const inputStyle = {
  padding: "0.5rem",
  fontSize: "1rem",
};

const buttonStyle = {
  padding: "0.75rem",
  fontSize: "1rem",
  cursor: "pointer",
  marginTop: "1rem",
};

const messageStyle = {
  marginTop: "1rem",
  padding: "1rem",
  borderRadius: "4px",
};

const successStyle = { ...messageStyle, backgroundColor: "#d4edda", color: "#155724" };
const errorStyle = { ...messageStyle, backgroundColor: "#f8d7da", color: "#721c24" };

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profileMessage, setProfileMessage] = useState({ type: "", text: "" });
  const [passwordMessage, setPasswordMessage] = useState({ type: "", text: "" });
  const [profileSubmitting, setProfileSubmitting] = useState(false);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileMessage({ type: "", text: "" });
    setProfileSubmitting(true);
    try {
      await userApi.updateProfile({ fullName, email });
      setProfileMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (err) {
      const text = err.response?.data?.message || "Failed to update profile.";
      setProfileMessage({ type: "error", text });
    } finally {
      setProfileSubmitting(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMessage({ type: "", text: "" });
    setPasswordSubmitting(true);
    try {
      await userApi.updatePassword({ currentPassword, newPassword });
      setPasswordMessage({ type: "success", text: "Password changed successfully!" });
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      const text = err.response?.data?.message || "Failed to change password.";
      setPasswordMessage({ type: "error", text });
    } finally {
      setPasswordSubmitting(false);
    }
  };

  if (authLoading) {
    return <div>Loading profile...</div>;
  }

  return (
    <div style={profileContainerStyle}>
      <h2>Edit Profile</h2>
      <form onSubmit={handleProfileUpdate} style={formStyle}>
        <div style={inputGroupStyle}>
          <label htmlFor="fullName" style={labelStyle}>Full Name</label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            style={inputStyle}
            required
          />
        </div>
        <div style={inputGroupStyle}>
          <label htmlFor="email" style={labelStyle}>Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            required
          />
        </div>
        <button type="submit" disabled={profileSubmitting} style={buttonStyle}>
          {profileSubmitting ? "Updating..." : "Update Profile"}
        </button>
        {profileMessage.text && (
          <div style={profileMessage.type === 'success' ? successStyle : errorStyle}>
            {profileMessage.text}
          </div>
        )}
      </form>

      <hr style={{ margin: "2rem 0" }} />

      <h2>Change Password</h2>
      <form onSubmit={handlePasswordChange} style={formStyle}>
        <div style={inputGroupStyle}>
          <label htmlFor="currentPassword" style={labelStyle}>Current Password</label>
          <input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            style={inputStyle}
            required
          />
        </div>
        <div style={inputGroupStyle}>
          <label htmlFor="newPassword" style={labelStyle}>New Password</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={inputStyle}
            required
            minLength="6"
          />
        </div>
        <button type="submit" disabled={passwordSubmitting} style={buttonStyle}>
          {passwordSubmitting ? "Changing..." : "Change Password"}
        </button>
        {passwordMessage.text && (
          <div style={passwordMessage.type === 'success' ? successStyle : errorStyle}>
            {passwordMessage.text}
          </div>
        )}
      </form>
    </div>
  );
};

export default Profile;