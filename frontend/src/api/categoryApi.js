import { api } from './apiClient';

export const categoryApi = {
  getAll: () => api.get('/categories'),
  getBySlug: (slug) => api.get(`/categories/${slug}`),
};
