import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: `${API_URL}/api`,
});

export const productService = {
  getAll: (limit = 20, offset = 0) =>
    api.get(`/products?limit=${limit}&offset=${offset}`),
  getById: (id) => api.get(`/products/${id}`),
  getCategories: () => api.get(`/products/categories`),
};

export const searchService = {
  search: (query, filters = {}) => {
    const params = new URLSearchParams({ q: query, ...filters });
    return api.get(`/search?${params}`);
  },
};

export const checkoutService = {
  createSession: (items, email) =>
    api.post(`/checkout/session`, { items, email }),
  getSuccess: (sessionId) => api.get(`/checkout/success?session_id=${sessionId}`),
};

export default api;