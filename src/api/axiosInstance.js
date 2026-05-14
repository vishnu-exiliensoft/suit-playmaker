import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:3000", // Add default URL for development
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor to add the auth token header to requests
axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle responses and errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle HTML responses (like 404 pages)
    if (error.response && error.response.data && typeof error.response.data === 'string' && error.response.data.includes('<!DOCTYPE')) {
      console.error('Received HTML response instead of JSON:', error.response.data.substring(0, 200));
      error.message = 'API endpoint returned HTML instead of JSON. Check if the API server is running.';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
