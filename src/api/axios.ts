// src/api/axios.ts
import axios, { 
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  type AxiosError
} from 'axios';

// Fixed base URL - includes the full backend URL
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) ?? 'http://localhost:5150/api';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL, // Now includes full backend URL + /api
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  timeout: 10000, // Reduced to 10 seconds for better UX
});

// Request interceptor
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // Get token from localStorage
  const token = localStorage.getItem('authToken');
  
  // Add Authorization header if token exists
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Handle FormData - let browser set Content-Type with boundary
  if (config.data instanceof FormData && config.headers) {
    delete config.headers['Content-Type'];
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // You can transform successful responses here if needed
    return response;
  },
  (error: AxiosError) => {
    // Handle errors according to backend's error format
    if (error.response) {
      const backendError = error.response.data as {
        message?: string;
        errors?: Record<string, string[]>;
      };
      
      console.error('Backend error:', backendError);
      
      // Handle specific status codes
      switch (error.response.status) {
        case 401:
          // Unauthorized - remove token and redirect to login
          localStorage.removeItem('authToken');
          window.location.href = '/login';
          break;
        case 403:
          // Forbidden - user doesn't have permission
          console.error('Access forbidden');
          break;
        case 404:
          // Not found
          console.error('Resource not found');
          break;
        case 500:
          // Server error
          console.error('Internal server error');
          break;
        default:
          console.error('HTTP error:', error.response.status);
      }
    } else if (error.request) {
      // Network error - request was made but no response received
      console.error('Network error - no response received:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;