import axios from "axios";
import useAuthStore from "../store/authStore";

const baseURL = import.meta.env.VITE_API_URL;

export const publicApi = axios.create({
  baseURL,
  timeout: 15000,
  withCredentials: true
});

const api = axios.create({
  baseURL,
  timeout: 15000,
  withCredentials: true
});

let refreshPromise = null;

export const requestTokenRefresh = async () => {
  const response = await publicApi.post("/auth/refresh");
  return response.data;
};

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthEndpoint =
      originalRequest?.url?.includes("/auth/login") || originalRequest?.url?.includes("/auth/refresh");

    if (error.response?.status !== 401 || originalRequest?._retry || isAuthEndpoint) {
      throw error;
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = requestTokenRefresh()
          .then((payload) => {
            useAuthStore.getState().setSession(payload.data.accessToken, payload.data.admin);
            return payload.data.accessToken;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      const accessToken = await refreshPromise;
      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      useAuthStore.getState().clearSession();

      if (window.location.pathname !== "/login") {
        window.location.assign("/login");
      }

      throw refreshError;
    }
  }
);

export default api;
