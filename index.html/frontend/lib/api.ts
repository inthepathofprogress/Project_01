import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/api/users/login', { email, password }),
  register: (data: any) => api.post('/api/users/register', data),
  getProfile: (userId: number) => api.get(`/api/users/${userId}`),
  updateProfile: (userId: number, data: any) =>
    api.put(`/api/users/${userId}`, data),
};

// Product APIs
export const productAPI = {
  getAllProducts: (params?: any) => api.get('/api/products', { params }),
  getProductById: (id: number) => api.get(`/api/products/${id}`),
  createProduct: (data: any) => api.post('/api/products', data),
  updateProduct: (id: number, data: any) =>
    api.put(`/api/products/${id}`, data),
  deleteProduct: (id: number) => api.delete(`/api/products/${id}`),
};

// Cart APIs
export const cartAPI = {
  getCart: (userId: number) => api.get(`/api/cart/user/${userId}`),
  addItem: (userId: number, item: any) =>
    api.post(`/api/cart/user/${userId}/items`, item),
  updateQuantity: (userId: number, productId: number, quantity: number) =>
    api.put(`/api/cart/user/${userId}/items/${productId}?quantity=${quantity}`),
  removeItem: (userId: number, productId: number) =>
    api.delete(`/api/cart/user/${userId}/items/${productId}`),
  clearCart: (userId: number) => api.delete(`/api/cart/user/${userId}`),
};

// Order APIs
export const orderAPI = {
  createOrder: (data: any) => api.post('/api/orders', data),
  getOrderById: (id: number) => api.get(`/api/orders/${id}`),
  getUserOrders: (userId: number) => api.get(`/api/orders/user/${userId}`),
  getAllOrders: () => api.get('/api/orders'),
  updateStatus: (id: number, status: string) =>
    api.patch(`/api/orders/${id}/status?status=${status}`),
};

// Payment APIs
export const paymentAPI = {
  processPayment: (data: any) => api.post('/api/payments/process', data),
  getPayment: (id: number) => api.get(`/api/payments/${id}`),
  getUserPayments: (userId: number) => api.get(`/api/payments/user/${userId}`),
};

export default api;

