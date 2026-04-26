import { publicApi, requestTokenRefresh } from "./axios";

export const loginRequest = async (payload) => {
  const response = await publicApi.post("/auth/login", payload);
  return response.data;
};

export const refreshSessionRequest = async () => requestTokenRefresh();

export const logoutRequest = async (refreshToken) => {
  const response = await publicApi.post("/auth/logout", refreshToken ? { refreshToken } : {});
  return response.data;
};
