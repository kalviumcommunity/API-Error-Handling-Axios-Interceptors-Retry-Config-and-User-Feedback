import axios from "axios";

// A single, shared Axios instance. Base URL comes from client/.env.development.
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Request interceptor: attach the auth token on the way out.
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

// Response interceptor: handle global errors on the way back.
apiClient.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;

    // 401 -> redirect to login
    if (status === 401) {
      window.location.href = "/login";
    }

    // 500+ -> show global error message
    if (status >= 500) {
      window.alert("Something went wrong. Please try again later.");
    }

    // Always re-throw the error so onError and retry can work.
    return Promise.reject(error);
  }
);

export default apiClient;