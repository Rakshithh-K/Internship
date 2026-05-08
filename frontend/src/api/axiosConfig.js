import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import {
  AUTH_MODE_SERVER,
  clearStoredAuth,
  getStoredAuthMode,
  getStoredToken,
  isJwtToken,
  isServerSession,
} from '../utils/auth';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    const authMode = getStoredAuthMode();

    if (authMode === AUTH_MODE_SERVER && isJwtToken(token)) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url || '';
    const isPublicAuthRequest = ['/auth/login', '/auth/signup', '/auth/forgot-password', '/auth/reset-password']
      .some((path) => requestUrl.includes(path));

    if (error.response?.status === 401 && !isPublicAuthRequest && isServerSession()) {
      clearStoredAuth();
      // Only redirect if not already on auth pages
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
