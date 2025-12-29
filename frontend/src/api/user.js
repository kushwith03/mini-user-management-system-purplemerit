import http from "./http";

export const getCurrentUser = () => {
  return http.get("/users/me");
};

export const updateProfile = (data) => {
  return http.put("/users/me", data);
};

export const changePassword = (data) => {
  return http.put("/users/change-password", data);
};
