import api from "../api/axios";

export const getAssets = () => api.get("assets/");
export const createAsset = (data) => api.post("assets/", data);
export const updateAsset = (id,data) => api.put(`assets/${id}/`, data);
export const deleteAsset = (id,data) => api.delete(`assets/${id}/`);
export const getUsers = () => api.get("user/userlist");

