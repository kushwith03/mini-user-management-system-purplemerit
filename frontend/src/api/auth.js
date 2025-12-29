import http from "./http";

export const signup = (userData) => {
  return http.post("/auth/signup", userData);
};

export const login = (credentials) => {
  return http.post("/auth/login", credentials);
};

export const logout = () => {
  return http.post("/auth/logout");
};