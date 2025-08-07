// src/services/api.js
import axios from 'axios';

// ✅ Use a single environment variable for the API base URL
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    // ⛔ Don't set Content-Type globally here
});

// ✅ Optional: Attach token from localStorage if it exists
api.interceptors.request.use((config) => {
    const admin = JSON.parse(localStorage.getItem('admin'));
    const token = admin?.token;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// ✅ Helpful for debugging
console.log('✅ API baseURL is set to:', api.defaults.baseURL);

export default api;
