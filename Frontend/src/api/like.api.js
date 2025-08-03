import axiosInstance from "../utils/axiosInstance";


const API_BASE = '/like';

export const likeVideo = async (videoId) => {
  return axiosInstance.patch(`${API_BASE}/?toggleLike=true`);
};

export const dislikeVideo = async (videoId) => {
  return axiosInstance.patch(`${API_BASE}/?toggleLike=false`);
};

export const getLikedVideos = async () => {
  return axiosInstance.get(`${API_BASE}/videos`);
};

export const getVideoLikeStats = async (videoId) => {
  return axiosInstance.get(`${API_BASE}/video/${videoId}/stats`);
};


export const getLikedComments = async (commentId) => {
  return axiosInstance.get(`${API_BASE}/comment/${commentId}`);
};

export const getLikedTweets = async (tweetId) => {
  return axiosInstance.get(`${API_BASE}/tweet/${tweetId}`);
};




