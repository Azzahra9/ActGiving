import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// Resolusi Base URL dari Environment Variable (Next.js / Vite / Fallback)
export const API_BASE_URL: string =
  (typeof import.meta !== 'undefined' && import.meta.env?.NEXT_PUBLIC_API_URL) ||
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) ||
  'http://127.0.0.1:8000/api';

// Root URL untuk endpoint root seperti /sanctum/csrf-cookie atau storage URL
export const BACKEND_ROOT_URL: string = API_BASE_URL.replace(/\/api\/?$/, '');

// Instance Axios utama untuk request REST API
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// Helper Token Storage
const TOKEN_KEY = 'actgiving_token';
const USER_KEY = 'actgiving_user';

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY) || localStorage.getItem('token');
};

export const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
    // Simpan juga ke cookies jika diperlukan
    document.cookie = `actgiving_token=${token}; path=/; max-age=2592000; SameSite=Lax`;
  }
};

export const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('token');
    localStorage.removeItem(USER_KEY);
    document.cookie = 'actgiving_token=; path=/; max-age=0; SameSite=Lax';
  }
};

// Request Interceptor: Menyisipkan Bearer Token otomatis pada setiap request
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAuthToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Tangani error global seperti 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token tidak valid atau sesi berakhir
      removeAuthToken();
    }
    return Promise.reject(error);
  }
);

/**
 * Fetch CSRF Cookie dari Laravel Sanctum sebelum melakukan request autentikasi (login/register).
 * Endpoint Laravel Sanctum: GET /sanctum/csrf-cookie
 */
export const getCsrfCookie = async (): Promise<void> => {
  await axios.get(`${BACKEND_ROOT_URL}/sanctum/csrf-cookie`, {
    withCredentials: true,
    headers: {
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
  });
};

export default api;
