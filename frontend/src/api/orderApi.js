import { api } from './apiClient';

export const orderApi = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getMyOrders: () => api.get('/orders'),
  getByOrderNumber: (orderNumber) => api.get(`/orders/${orderNumber}`),
};
