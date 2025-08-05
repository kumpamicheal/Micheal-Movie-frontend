// src/services/api.js
import axios from 'axios';

const isDev = process.env.NODE_ENV === 'development';

const api = axios.create({
    baseURL: isDev
        ? 'http://localhost:5000/api'
        : 'https://micheal-movie-backend.onrender.com/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Optional: Attach token if available in localStorage
api.interceptors.request.use((config) => {
    const admin = JSON.parse(localStorage.getItem('admin'));
    const token = admin?.token;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// Optional: Log the base URL for debugging
console.log('✅ API baseURL is set to:', api.defaults.baseURL);

export default api;
