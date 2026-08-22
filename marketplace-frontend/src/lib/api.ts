import axios from 'axios';

// ============================================================
// Backend URL – Prefer environment variable, fallback to hardcoded
// ============================================================
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://prime-marketplace-8hut.onrender.com';

console.log('🔗 API Base URL:', API_BASE_URL);

// Optional: Warn if still using localhost in production
if (typeof window !== 'undefined' && API_BASE_URL.includes('localhost')) {
    console.warn('⚠️ Using localhost API – make sure your backend is running.');
}

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 120000, // ✅ Increase to 120 seconds
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
            console.error(`❌ API Error (${error.response.status}):`, error.response.data);
        } else if (error.request) {
            console.error('❌ No response from backend – is it running?', error.request);
            console.error('🔍 Check that your API_BASE_URL is correct:', API_BASE_URL);
            console.error('🔍 If on Vercel, ensure NEXT_PUBLIC_API_URL is set correctly.');
        } else {
            console.error('❌ API Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default api;