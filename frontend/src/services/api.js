import axios from 'axios';

// API Axios Instance
const api = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 30000,
});

// Request Interceptor to attach Auth Token and handle FormData Content-Type
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('alumni_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    } else if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const url = error.config && error.config.url ? error.config.url : '';
      if (!url.includes('/auth/login')) {
        localStorage.removeItem('alumni_auth_token');
        localStorage.removeItem('alumni_user_data');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
