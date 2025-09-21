// axiosInstance.js
import axios from "axios";
import { refreshTokenRequest } from "./auth.helper";



const baseURL = "https://streamai-1yrk.onrender.com/api/v1";

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
   (config) => {
    let token = localStorage.getItem('accessToken');

    if(token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
   },
   (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshTokenRequest();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest); // retry original request
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        // optional: redirect to login
        //window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);
