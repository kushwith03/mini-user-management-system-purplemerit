import React, { createContext, useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import * as authApi from "../api/auth";
import * as userApi from "../api/user";
import http from "../api/http";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    authApi.logout().catch(err => console.error("Logout API call failed, proceeding with client-side logout.", err));
    localStorage.removeItem("token");
    http.defaults.headers.common['Authorization'] = null;
    setToken(null);
    setUser(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    const fetchUserOnLoad = async () => {
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          if (decodedToken.exp * 1000 < Date.now()) {
            logout();
            return;
          }
          
          http.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await userApi.getProfile();
          setUser(response.data);

        } catch (error) {
          console.error("Failed to fetch user profile on load", error);
          logout();
        }
      }
      setLoading(false);
    };

    fetchUserOnLoad();
  }, [token, logout]);

  const login = async (credentials) => {
    try {
      const response = await authApi.login(credentials);
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      http.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setToken(token);
      setUser(user);
    } catch (err) {
      throw err;
    }
  };

  const signup = async (userData) => {
    try {
      const response = await authApi.signup(userData);
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      http.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setToken(token);
      setUser(user);
    } catch (err) {
      throw err;
    }
  };
  
  const updateUser = (updatedUserData) => {
    setUser(currentUser => ({...currentUser, ...updatedUserData}));
  }

  const value = {
    user,
    token,
    loading,
    login,
    signup,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
