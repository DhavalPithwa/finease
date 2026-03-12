import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const api = axios.create({
  baseURL: API_BASE_URL,
});

let activeRequests = 0;

function updateLoadingState(delta: number) {
  activeRequests += delta;
  if (typeof window !== "undefined") {
    const event = new CustomEvent("api-loading", {
      detail: activeRequests > 0,
    });
    window.dispatchEvent(event);
  }
}

// Interceptor to add token to requests
api.interceptors.request.use(
  (config) => {
    updateLoadingState(1);
    const token = localStorage.getItem("finease_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    updateLoadingState(-1);
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    updateLoadingState(-1);
    return response;
  },
  (error) => {
    updateLoadingState(-1);
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("finease_token");
        window.dispatchEvent(new CustomEvent("finease-auth-failure"));
      }
    }
    return Promise.reject(error);
  },
);

export default api;
