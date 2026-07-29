import axios from 'axios';

// 🔍 Debug: log the URL being used
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
console.log('🔗 API Base URL:', API_BASE_URL);

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;