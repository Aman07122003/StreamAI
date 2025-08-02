import axiosInstance from "../utils/axiosInstance";

const API_URL = "/subscription";

export const toggleSubscription = async (channelId) => {
  const response = await axiosInstance.patch(`${API_URL}/${channelId}`);
  return response.data;
};

export const getUserChannelSubscribers = async (channelId) => {
  const response = await axiosInstance.get(`${API_URL}/${channelId}`);
  console.log(response);
  return response.data;
};

export const getSubscribedChannels = async (subscriberId) => {
  const response = await axiosInstance.get(`${API_URL}/users/${subscriberId}`);
  return response.data;
};

export const getSubscriberCount = async (channelId) => {
  const response = await axiosInstance.get(`${API_URL}/${channelId}/count`);
  return response.data;
};