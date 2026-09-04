import axios from "axios";

let accessToken = null;
let refreshRequest = null;

export const setAccessToken = (token) => { accessToken = token; };

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config;
    const isAuthRequest = request?.url?.startsWith("/auth/");
    if (error.response?.status !== 401 || request?._retry || isAuthRequest) return Promise.reject(error);
    request._retry = true;
    refreshRequest ??= api.post("/auth/refresh").then(({ data }) => data.data.accessToken).finally(() => { refreshRequest = null; });
    const token = await refreshRequest;
    setAccessToken(token);
    request.headers.Authorization = `Bearer ${token}`;
    return api(request);
  },
);

export default api;
