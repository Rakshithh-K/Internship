import api from './axiosConfig';

export const adminApi = {
  getDashboard: () => api.get('/admin/dashboard'),
  getProducts: (params) => api.get('/products', { params }),
  addProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  getOrders: (params) => api.get('/admin/orders', { params }),
  updateOrderStatus: (id, status) => api.patch(`/admin/orders/${id}/status`, { status }),
  getUsers: (params) => api.get('/admin/users', { params }),
};
