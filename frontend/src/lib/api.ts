import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
});

// -- PEMBERSIH PAYLOAD FRONTEND (ANTI XSS / INJECTION) --
function sanitizeValue(value: any): any {
  if (typeof value === 'string') {
    // Basic XSS tag stripper & hapus script tags
    return value
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/on\w+="[^"]*"/g, '')
      .replace(/javascript:/gi, '')
      .trim();
  }
  if (value && typeof value === 'object') {
    if (Array.isArray(value)) return value.map(sanitizeValue);
    const sanitizedObj: any = {};
    for (const key in value) sanitizedObj[key] = sanitizeValue(value[key]);
    return sanitizedObj;
  }
  return value;
}

// Injeksi token JWT ke setiap request yang keluar & Sanitasi Payload
api.interceptors.request.use((config) => {
  const token = Cookies.get('oska_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Sanitasi body POST/PUT
  if (config.data && config.headers['Content-Type'] !== 'multipart/form-data') {
    // Jangan sanitasi form-data / file upload binary, hanya JSON
    if (!(config.data instanceof FormData)) {
      config.data = sanitizeValue(config.data);
    }
  }
  
  return config;
});

// Jika server membalas 401 (token kadaluarsa/invalid), logout paksa
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('oska_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
