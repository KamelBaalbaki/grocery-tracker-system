import axios from 'axios';

// Base URLs for each microservice
const AUTH_URL = '/api/auth';
const USERS_URL = '/api/users';
const ITEMS_URL = '/api/items';
const REMINDERS_URL = '/api/reminders';

// Create axios instance with default config
const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (userData) => {
    const response = await api.post(`${AUTH_URL}/register`, userData);
    return response.data;
  },
  
  login: async (credentials) => {
    const response = await api.post(`${AUTH_URL}/login`, credentials);
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post(`${USERS_URL}/logout`);
    return response.data;
  },
  
  getMe: async () => {
    const response = await api.get(`${USERS_URL}/me`);
    return response.data;
  },
};

// Items API
export const itemsAPI = {
  getAll: async () => {
    const response = await api.get(ITEMS_URL);
    return response.data;
  },
  
  create: async (itemData) => {
    const response = await api.post(ITEMS_URL, itemData);
    return response.data;
  },
  
  update: async (itemId, itemData) => {
    const response = await api.put(`${ITEMS_URL}/${itemId}`, itemData);
    return response.data;
  },
  
  delete: async (itemId) => {
    const response = await api.delete(`${ITEMS_URL}/${itemId}`);
    return response.data;
  },
};

// Reminders API
export const remindersAPI = {
  getAll: async () => {
    const response = await api.get(REMINDERS_URL);
    return response.data;
  },
  
  create: async (reminderData) => {
    const response = await api.post(REMINDERS_URL, reminderData);
    return response.data;
  },
  
  update: async (reminderId, reminderData) => {
    const response = await api.put(`${REMINDERS_URL}/${reminderId}`, reminderData);
    return response.data;
  },
  
  delete: async (reminderId) => {
    const response = await api.delete(`${REMINDERS_URL}/${reminderId}`);
    return response.data;
  },
};

export default api;
