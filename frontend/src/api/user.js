import http from "./http";

export const getProfile = () => {
  return http.get("/users/me");
};

export const updateProfile = (profileData) => {
  return http.put("/users/me", profileData);
};

export const updatePassword = (passwordData) => {
  return http.put("/users/me/password", passwordData);
};