import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use(
    (config) => {
        let token;
        if (localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))) token = JSON.parse(localStorage.getItem('user')).token ?? false; // Use your actual token key
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;