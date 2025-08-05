// src/services/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',

    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const admin = JSON.parse(localStorage.getItem('admin'));
    const token = admin?.token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
console.log('API baseURL is set to:', api.defaults.baseURL);

export default api;
