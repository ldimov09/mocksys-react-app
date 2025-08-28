import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: false,
});

api.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('user');
    const token = user ? JSON.parse(user)?.token : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const locale = localStorage.getItem('locale');
    if (locale) {
      config.headers["X-Locale"] = JSON.parse(locale);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
