// lib/api.ts
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000', // URL Backend NestJS kamu
});

if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
}

export default api;