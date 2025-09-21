import { axiosInstance } from "./axios.helper";

export const refreshTokenRequest = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) throw new Error("No refresh token available");

  const response = await axiosInstance.post("/users/refresh-token", { refreshToken });
  const { accessToken, refreshToken: newRefreshToken } = response.data.data;

  // update localStorage directly
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", newRefreshToken);

  return accessToken;
};
