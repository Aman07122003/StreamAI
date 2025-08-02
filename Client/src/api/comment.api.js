import axiosInstance from "../utils/axiosInstance";

const API_BASE = '/comment';

export const getComments = (videoId) => {
  return axiosInstance.get(`${API_BASE}/get/${videoId}`);
};

export const addComment = (videoId, content, token) => {
  return axiosInstance.post(
    `${API_BASE}/add/${videoId}`,
    { content },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const updateComment = (commentId, content, token) => {
  return axiosInstance.patch(
    `${API_BASE}/${commentId}`,
    { content },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const deleteComment = (commentId, token) => {
  return axiosInstance.delete(`${API_BASE}/${commentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
