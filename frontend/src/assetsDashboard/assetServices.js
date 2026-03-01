import api from "../api/axios";

export const getAssets = () => api.get("assets/");
export const createAsset = (data) => api.post("assets/", data);
export const updateAsset = (data) => api.put(`assets/${id}/`, data);
export const deleteAsset = (data) => api.delete(`assets/${id}/`);