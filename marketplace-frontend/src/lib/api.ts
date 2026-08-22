import axios from 'axios';

// ============================================================
// Backend URL – change this to your actual backend URL
// ============================================================
const PRODUCTION_URL = 'https://prime-marketplace-8hut.onrender.com';
const LOCAL_URL = 'https://localhost:7195'; // your local backend (optional)

// Set to false to use local backend for development
const USE_PRODUCTION = true;

const API_BASE_URL = USE_PRODUCTION ? PRODUCTION_URL : LOCAL_URL;

console.log('🔗 API Base URL:', API_BASE_URL);

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 seconds timeout
});

// ============================================================
// Request interceptor – adds JWT token to every request
// ============================================================
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// ============================================================
// Response interceptor – handles errors globally
// ============================================================
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.code === 'ECONNABORTED') {
            console.error('⏱️ Request timeout – backend might be sleeping (Render free tier).');
        } else if (error.response) {
            // Server responded with an error status (4xx, 5xx)
            console.error(`❌ API Error (${error.response.status}):`, error.response.data);
        } else if (error.request) {
            // Request was made but no response received (backend down)
            console.error('❌ No response from backend – is it running?', error.request);
        } else {
            console.error('❌ API Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default api;