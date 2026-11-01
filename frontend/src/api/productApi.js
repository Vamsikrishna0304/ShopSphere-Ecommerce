import { api } from './apiClient';

export const productApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams();
    if (params.categoryId) query.append('categoryId', params.categoryId);
    if (params.minPrice) query.append('minPrice', params.minPrice);
    if (params.maxPrice) query.append('maxPrice', params.maxPrice);
    if (params.search) query.append('search', params.search);
    if (params.page !== undefined) query.append('page', params.page);
    if (params.size) query.append('size', params.size);
    if (params.sortBy) query.append('sortBy', params.sortBy);
    if (params.direction) query.append('direction', params.direction);

    const qs = query.toString();
    return api.get(`/products${qs ? `?${qs}` : ''}`);
  },
  getFeatured: () => api.get('/products/featured'),
  getBySlug: (slug) => api.get(`/products/${slug}`),
  getById: (id) => api.get(`/products/id/${id}`),
  getReviews: (productId) => api.get(`/reviews/product/${productId}`),
  addReview: (productId, reviewData) => api.post(`/reviews/product/${productId}`, reviewData),
};
