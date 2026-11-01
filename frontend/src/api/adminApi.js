import { api } from './apiClient';

export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getOrders: (params = {}) => {
    const query = new URLSearchParams();
    if (params.status) query.append('status', params.status);
    if (params.page !== undefined) query.append('page', params.page);
    if (params.size) query.append('size', params.size);
    const qs = query.toString();
    return api.get(`/admin/orders${qs ? `?${qs}` : ''}`);
  },
  updateOrderStatus: (orderId, status) => api.put(`/admin/orders/${orderId}/status`, { status }),
  createProduct: (productData) => api.post('/admin/products', productData),
  updateProduct: (id, productData) => api.put(`/admin/products/${id}`, productData),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
  createCategory: (categoryData) => api.post('/admin/categories', categoryData),
};
