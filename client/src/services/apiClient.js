import axios from "axios";

// A single, shared Axios instance. Base URL comes from client/.env.development.
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// 🔹 Request interceptor: attach the auth token
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

// 🔹 Response interceptor: handle global errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // redirect to login
      window.location.href = "/login";
    } else if (status >= 500) {
      // global message
      window.alert("Server error. Please try again later.");
    }
    // let 400/404/409 pass through
    return Promise.reject(error);
  }
);

export default apiClient;
