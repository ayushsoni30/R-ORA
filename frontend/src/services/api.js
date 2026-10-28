import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('roomora_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        localStorage.removeItem('roomora_token');
        localStorage.removeItem('roomora_user');
        window.dispatchEvent(new Event('roomora_auth_expired'));
      }
    }
    return Promise.reject(error);
  }
);

export function getErrorMessage(error) {
  if (!error) return 'An unexpected error occurred.';
  if (error.response?.data?.detail) {
    const detail = error.response.data.detail;
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail)) {
      return detail.map((d) => d.msg || `${d.loc?.join('.')}: invalid value`).join(', ');
    }
    return JSON.stringify(detail);
  }
  if (error.response?.data?.message) return error.response.data.message;
  if (error.message === 'Network Error') return 'Unable to reach the server. Please check if the backend is running.';
  return error.message || 'An unexpected error occurred.';
}

export default api;
