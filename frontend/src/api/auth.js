frontend / src / api / auth.js;
import http from "./http";

export const signup = (data) => {
  return http.post("/auth/signup", data);
};

export const login = (data) => {
  return http.post("/auth/login", data);
};

export const logout = () => {
  localStorage.removeItem("auth_token");
};
