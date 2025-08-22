import axios from "axios";

const devURL = "http://localhost:3000/api/v1";
const prodURL = "https://streamai-1yrk.onrender.com/api/v1";

const URL = import.meta.env.MODE === "development" ? devURL : prodURL;

const axiosInstance = axios.create({
  baseURL: URL,
  withCredentials: true,
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accesstoken"); // ✅ match Redux slice key
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          `${URL}/users/refresh-token`, // ✅ use same base URL
          {},
          { withCredentials: true }
        );

        const newAccessToken = response.data.accessToken;

        // ✅ update storage + headers
        localStorage.setItem("accesstoken", newAccessToken);
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest); // retry
      } catch (refreshError) {
        localStorage.removeItem("accesstoken");
        localStorage.removeItem("refreshtoken");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
