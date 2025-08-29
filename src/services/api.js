// src/services/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'https://micheal-movie-backend.onrender.com/api', // production URL
});


// ✅ Always read admin fresh before each request
api.interceptors.request.use((config) => {
    const adminStr = localStorage.getItem('admin');
    if (adminStr) {
        try {
            const admin = JSON.parse(adminStr);
            if (admin?.token) {
                config.headers.Authorization = `Bearer ${admin.token}`;
            }
        } catch (err) {
            console.error('Error parsing admin from localStorage:', err);
        }
    }
    return config;
});

console.log('✅ API baseURL is set to:', api.defaults.baseURL);

export default api;
