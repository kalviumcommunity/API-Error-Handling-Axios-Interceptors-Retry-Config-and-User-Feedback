
import axios from "axios";

// Shared Axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// TODO 1 — Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// TODO 2 — Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      window.location.href = "/login";
    } else if (status >= 500) {
      window.alert("Server error. Please try again later.");
    }

    return Promise.reject(error);
  }
);

export default apiClient;
