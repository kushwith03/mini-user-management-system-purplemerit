import http from "./http";

export const getAllUsers = (page = 1, limit = 10) => {
  return http.get(`/admin/users?page=${page}&limit=${limit}`);
};

export const activateUser = (userId) => {
  return http.put(`/admin/users/${userId}/activate`);
};

export const deactivateUser = (userId) => {
  return http.put(`/admin/users/${userId}/deactivate`);
};
