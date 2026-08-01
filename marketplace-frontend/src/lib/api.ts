import axios from 'axios';

// 🔥 Set to your local backend URL
const API_BASE_URL = 'https://localhost:7195';   // or 'http://localhost:5019'

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