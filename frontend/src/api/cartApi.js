import { api } from './apiClient';

export const cartApi = {
  getCart: () => api.get('/cart'),
  addItem: (productId, quantity = 1) => api.post('/cart/items', { productId, quantity }),
  updateQuantity: (itemId, quantity) => api.put(`/cart/items/${itemId}`, { quantity }),
  removeItem: (itemId) => api.delete(`/cart/items/${itemId}`),
  clearCart: () => api.delete('/cart'),
};
