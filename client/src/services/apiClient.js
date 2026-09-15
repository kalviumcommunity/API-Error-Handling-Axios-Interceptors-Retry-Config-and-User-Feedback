import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});


// ─────────────────────────────────────────────
// REQUEST INTERCEPTOR
// Adds the token before sending the request
// ─────────────────────────────────────────────

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// ─────────────────────────────────────────────
// RESPONSE INTERCEPTOR
// Handles global API errors
// ─────────────────────────────────────────────

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const status = error.response?.status;

    // 401 → send user to login page
    if (status === 401) {
      window.location.href = "/login";
    }

    // 5xx → show global server error message
    if (status >= 500) {
      window.alert("Something went wrong on the server. Please try again later.");
    }

    // 400, 404, 409 etc. → let the component handle them
    return Promise.reject(error);
  }
);

export default apiClient;