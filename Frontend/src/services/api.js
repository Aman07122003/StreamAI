import axios from 'axios';

const BASE_URL = 
  'https://streamai-1yrk.onrender.com/api/v1';


const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;

      const oldAccessToken = localStorage.getItem('accessToken');
      const oldRefreshToken = localStorage.getItem('refreshToken');
      console.log("🔴 Old Access Token:", oldAccessToken);
      console.log("🔴 Old Refresh Token:", oldRefreshToken);

      if (oldRefreshToken) {
        try {
          const res = await axios.post(`${BASE_URL}/auth/refresh-token`, { refreshToken: oldRefreshToken });
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = res.data.data;

          console.log("🟢 New Access Token:", newAccessToken);
          console.log("🟢 New Refresh Token:", newRefreshToken);

          // update localStorage
          localStorage.setItem('accessToken', newAccessToken);
          if (newRefreshToken) {
            localStorage.setItem('refreshToken', newRefreshToken);
          }

          // retry the original request with new token
          error.config.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(error.config);
        } catch (refreshError) {
          console.error('❌ Token refresh failed:', refreshError);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// API calls
export const authAPI = {
  register: async (userData) => {
    const formData = new FormData();
    Object.keys(userData).forEach((key) => {
      formData.append(key, userData[key]);
    });

    return api.post('/users/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  login: async (credentials) => {
    const response = await api.post('/users/login', credentials);
    const { user, accessToken, refreshToken } = response.data.data;

    // persist tokens + user
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));

    return response;
  },

  logout: async () => {
    await api.post('/users/logout');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  refreshToken: async (refreshToken) => {
    return api.post('/auth/refresh-token', { refreshToken });
  },
};

export const userAPI = {
  getCurrentUser: () => api.get('/users/me'),
  updateProfile: (userData) => api.patch('/users/me', userData),
  updateAvatar: (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.patch('/users/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  updateCoverImage: (file) => {
    const formData = new FormData();
    formData.append('coverImage', file);
    return api.patch('/users/me/cover', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export default api;
