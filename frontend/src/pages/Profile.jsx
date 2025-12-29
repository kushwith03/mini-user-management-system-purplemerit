import React, { useState, useMemo } from "react";
import toast from "react-hot-toast";
import * as userApi from "../api/user";
import { useAuth } from "../auth/AuthContext";
import { validateEmail, validateFullName, validatePassword } from "../utils/validators";
import Card from "../components/Card";
import styles from "./Profile.module.css";

const Profile = () => {
  const { user, updateUser } = useAuth();
  
  const [profileData, setProfileData] = useState({ fullName: user?.full_name || "", email: user?.email || "" });
  const [profileErrors, setProfileErrors] = useState({});
  const [profileSubmitting, setProfileSubmitting] = useState(false);

  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "" });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);

  const handleProfileChange = (e) => {
    const { id, value } = e.target;
    setProfileData(prev => ({ ...prev, [id]: value }));
  };

  const handlePasswordChange = (e) => {
    const { id, value } = e.target;
    setPasswordData(prev => ({ ...prev, [id]: value }));
  };

  const handleBlur = (e, formType) => {
    const { id, value } = e.target;
    let error = "";
    if (id === "fullName") error = validateFullName(value);
    if (id === "email") error = validateEmail(value);
    if (id === "newPassword") error = validatePassword(value);
    
    if (formType === 'profile') {
      setProfileErrors(prev => ({ ...prev, [id]: error }));
    } else {
      setPasswordErrors(prev => ({ ...prev, [id]: error }));
    }
  };

  const isProfileFormValid = useMemo(() => {
    return Object.values(profileErrors).every(err => !err) && Object.values(profileData).every(field => field);
  }, [profileErrors, profileData]);

  const isPasswordFormValid = useMemo(() => {
    return Object.values(passwordErrors).every(err => !err) && Object.values(passwordData).every(field => field);
  }, [passwordErrors, passwordData]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!isProfileFormValid) return;
    setProfileSubmitting(true);
    try {
      const updatedUser = await userApi.updateProfile(profileData);
      updateUser(updatedUser.data);
      toast.success("Profile updated successfully!");
    } catch (err) {
      const message = err.response?.data?.message || "Failed to update profile.";
      toast.error(message);
    } finally {
      setProfileSubmitting(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!isPasswordFormValid) return;
    setPasswordSubmitting(true);
    try {
      await userApi.updatePassword(passwordData);
      toast.success("Password changed successfully!");
      setPasswordData({ currentPassword: "", newPassword: "" });
      setPasswordErrors({});
    } catch (err) {
      const message = err.response?.data?.message || "Failed to change password.";
      toast.error(message);
    } finally {
      setPasswordSubmitting(false);
    }
  };

  const handleProfileCancel = () => {
    setProfileData({ fullName: user?.full_name || "", email: user?.email || "" });
    setProfileErrors({});
  };

  const handlePasswordCancel = () => {
    setPasswordData({ currentPassword: "", newPassword: "" });
    setPasswordErrors({});
  };

  return (
    <div className={styles.container}>
      <Card title="Edit Profile">
        <form onSubmit={handleProfileUpdate} className={styles.form} noValidate>
          <div className={styles.inputGroup}>
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              value={profileData.fullName}
              onChange={handleProfileChange}
              onBlur={(e) => handleBlur(e, 'profile')}
              required
              aria-describedby="profile-fullName-error"
            />
            <div id="profile-fullName-error" className={styles.errorText} aria-live="polite">{profileErrors.fullName}</div>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={profileData.email}
              onChange={handleProfileChange}
              onBlur={(e) => handleBlur(e, 'profile')}
              required
              aria-describedby="profile-email-error"
            />
            <div id="profile-email-error" className={styles.errorText} aria-live="polite">{profileErrors.email}</div>
          </div>
          <div className={styles.buttonGroup}>
            <button type="button" onClick={handleProfileCancel} className="button-secondary">
              Cancel
            </button>
            <button type="submit" disabled={profileSubmitting || !isProfileFormValid} className="button-primary">
              {profileSubmitting ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </form>
      </Card>

      <Card title="Change Password">
        <form onSubmit={handlePasswordUpdate} className={styles.form} noValidate>
          <div className={styles.inputGroup}>
            <label htmlFor="currentPassword">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              onBlur={(e) => handleBlur(e, 'password')}
              required
              minLength="6"
              aria-describedby="password-new-error"
            />
            <div id="password-new-error" className={styles.errorText} aria-live="polite">{passwordErrors.newPassword}</div>
          </div>
          <div className={styles.buttonGroup}>
            <button type="button" onClick={handlePasswordCancel} className="button-secondary">
              Cancel
            </button>
            <button type="submit" disabled={passwordSubmitting || !isPasswordFormValid} className="button-primary">
              {passwordSubmitting ? "Changing..." : "Change Password"}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Profile;
