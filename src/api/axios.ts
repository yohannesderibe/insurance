// src/api/axios.ts
import axios, { 
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  type AxiosError
} from 'axios';

// 1. from your backend team or API documentation
// Prefer a Vite environment variable (VITE_API_BASE_URL). When not provided we fall
// back to the relative path '/api' so Vite's dev-server proxy (configured in
// `vite.config.ts`) can forward requests to the backend and avoid CORS during
// development. In production set VITE_API_BASE_URL to the full backend URL.
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) ?? '/api';


const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json'
  },
  timeout: 100000,
});

// Request interceptor
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('authToken');
  //  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
     // Set Content-Type for JSON requests only:
    if (config.data && !(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    } else {
      // Let browser set the Content-Type for FormData (multipart)
      delete config.headers['Content-Type'];
    }
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Handle errors according to backend's error format
    if (error.response) {
      const backendError = error.response.data as {
        message?: string;
        errors?: Record<string, string[]>;
      };
      console.error('Backend error:', backendError);
    }
    return Promise.reject(error);
  }
);


export default api;