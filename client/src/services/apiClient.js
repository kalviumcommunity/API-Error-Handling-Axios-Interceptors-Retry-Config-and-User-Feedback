import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3001",
});

// REQUEST INTERCEPTOR
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

// RESPONSE INTERCEPTOR
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const status = error.response?.status;

    // 401 → redirect to login
    if (status === 401) {
      window.location.href = "/login";
    }

    // 500+ → show global error message
    if (status >= 500) {
      window.alert("Something went wrong. Please try again later.");
    }

    // Other 4xx errors → no special handling

    return Promise.reject(error);
  }
);

export default apiClient;