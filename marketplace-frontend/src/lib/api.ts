import axios from 'axios';

const api = axios.create({
  // Use the environment variable, but fallback to the Render URL if missing
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://prime-marketplace-8hut.onrender.com',
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