import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// ===============================
// REQUEST INTERCEPTOR
// ===============================
// Runs before every API request
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

// ===============================
// RESPONSE INTERCEPTOR
// ===============================
// Runs after every API response
apiClient.interceptors.response.use(
  (response) => {
    // Successful response → pass it through
    return response;
  },
  (error) => {
    const status = error.response?.status;

    // 401 → authentication failed
    if (status === 401) {
      window.location.href = "/login";
    }

    // 5xx → server error
    if (status >= 500) {
      window.alert("Something went wrong. Please try again later.");
    }

    // 400, 404, 409 and other errors
    // pass through to the component/TanStack Query
    return Promise.reject(error);
  }
);

export default apiClient;