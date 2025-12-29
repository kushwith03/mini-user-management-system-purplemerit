import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import * as authApi from "../api/auth";
import * as userApi from "../api/user";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      const isExpired = decodedToken.exp * 1000 < Date.now();
      if (isExpired) {
        logout();
      } else {
        fetchUserProfile();
      }
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const response = await userApi.getProfile();
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch user profile", error);
      logout(); // Token might be invalid
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    const response = await authApi.login(credentials);
    const { token, user } = response.data;
    localStorage.setItem("token", token);
    setToken(token);
    setUser(user);
  };

  const signup = async (userData) => {
    const response = await authApi.signup(userData);
    const { token, user } = response.data;
    localStorage.setItem("token", token);
    setToken(token);
    setUser(user);
  };

  const logout = () => {
    authApi.logout().catch(err => console.error("Logout API call failed, proceeding with client-side logout.", err));
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};