import axiosInstance from "../utils/axiosInstance";
const API_BASE = '/users';

export const getUserProfile = async () => {
    return axiosInstance.get(`${API_BASE}/get-current-user`);
    }

export const getUserByUsername = async (username) => {
    return axiosInstance.get(`${API_BASE}/${username}`);
}

export const updateUserProfile = async (payload) => {
    return axiosInstance.patch(`${API_BASE}/update`, payload, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

export const deleteUserAccount = async () => {
    return axiosInstance.delete(`${API_BASE}/delete`);
}

export const getUserVideos = async (username) => {
    return axiosInstance.get(`${API_BASE}/${username}/videos`);
}

export const getUserPlaylists = async (username) => {
    return axiosInstance.get(`${API_BASE}/${username}/playlists`);
}

export const getUserLikedVideos = async (username) => {
    return axiosInstance.get(`${API_BASE}/${username}/liked-videos`);
}

export const getUserComments = async (username) => {
    return axiosInstance.get(`${API_BASE}/${username}/comments`);
}

export const getUserTweets = async (username) => {
    return axiosInstance.get(`${API_BASE}/${username}/tweets`);
}