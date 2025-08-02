import axiosInstance from "../utils/axiosInstance";
const API_BASE = '/dashboard';

export const getChannelStats = async () => {
  return axiosInstance.get(`${API_BASE}/states`);
};

export const getChannelVideos = async () => {
  return axiosInstance.get(`${API_BASE}/videos`);
};