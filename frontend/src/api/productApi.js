import api from './axiosConfig';

export const productApi = {
  getProducts: (params) => api.get('/products', { params }),
  getProductById: (id) => api.get(`/products/${id}`),
  getTrending: () => api.get('/products/trending'),
  getFeatured: () => api.get('/products/featured'),
  getNewArrivals: () => api.get('/products/new-arrivals'),
  searchProducts: (query) => api.get('/products/search', { params: { q: query } }),
  getCategories: () => api.get('/categories'),
  getCategoriesByGender: (gender) => api.get(`/categories/${gender}`),
  getReviews: (productId) => api.get(`/reviews/product/${productId}`),
  addReview: (data) => api.post('/reviews', data),
};
