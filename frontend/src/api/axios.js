// src/api/axios.js
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL,                  // <-- must be your Railway HTTPS URL in prod
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});



export default api;
