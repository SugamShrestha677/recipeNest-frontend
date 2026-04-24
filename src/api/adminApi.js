import apiClient from './apiClient';

export const adminApi = {
  getDashboard: () => apiClient.get('/admin/dashboard'),
  getRecipes: (params = {}) => apiClient.get('/admin/recipes', { params }),
  setRecipePublishStatus: (id, published) =>
    apiClient.patch(`/admin/recipes/${id}/publish`, { published }),
  deleteRecipe: (id) => apiClient.delete(`/admin/recipes/${id}`),
  getChefs: (params = {}) => apiClient.get('/admin/chefs', { params }),
  updateChefRole: (id, role) => apiClient.patch(`/admin/chefs/${id}/role`, { role }),
  updateChefStatus: (id, isActive) => apiClient.patch(`/admin/chefs/${id}/status`, { isActive }),
  deleteChef: (id) => apiClient.delete(`/admin/chefs/${id}`)
};
