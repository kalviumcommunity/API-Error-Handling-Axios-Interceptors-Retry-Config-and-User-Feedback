import axios from "axios";

// A single, shared Axios instance. Base URL comes from client/.env.development.
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// TODO 1 — Request interceptor: attach the auth token on the way out.
// - read localStorage.getItem("token")
// - if present, set config.headers.Authorization = `Bearer ${token}`
// - return config
// - add an error handler that returns Promise.reject(error)
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

// TODO 2 — Response interceptor: handle global errors on the way back.
// - success: return response untouched
// - error, based on error.response?.status:
//     401   -> window.location.href = "/login"
//     >=500 -> window.alert("...") (or a toast)
//     else  -> let it pass through (400/409/404 belong to the component)
// - ALWAYS end with: return Promise.reject(error)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      window.location.href = "/login";
    } else if (status >= 500) {
      window.alert("The server is temporarily unavailable. Please try again.");
    }

    return Promise.reject(error);
  }
);

export default apiClient;
