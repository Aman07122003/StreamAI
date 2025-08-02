// likes.api.js
import axiosInstance from "../utils/axiosInstance";

export const toggleLike = (videoId, type) => {
  // type should be 'like' or 'dislike'
  const toggleLike = type === 'like' ? 'true' : 'false';
  return axiosInstance.patch(`/like?videoId=${videoId}&toggleLike=${toggleLike}`);
};

export const getVideoLikeStats = (videoId) => {
  return axiosInstance.get(`/like/video/${videoId}/stats`);
};

export const getLikedVideos = () => {
  return axiosInstance.get(`/like/videos`);
};






