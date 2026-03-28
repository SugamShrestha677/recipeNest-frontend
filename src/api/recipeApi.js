import apiClient from './apiClient';

export const recipeApi = {
  // Get all recipes
  getAll: (params = {}) => {
    return apiClient.get('/recipes', { params });
  },
  
  // Get single recipe
  getById: (id) => {
    return apiClient.get(`/recipes/${id}`);
  },
  
  // Create recipe
  create: (data) => {
    return apiClient.post('/recipes', data);
  },
  
  // Update recipe
  update: (id, data) => {
    return apiClient.put(`/recipes/${id}`, data);
  },
  
  // Delete recipe
  delete: (id) => {
    return apiClient.delete(`/recipes/${id}`);
  },
  
  // Like recipe
  like: (id) => {
    return apiClient.post(`/recipes/${id}/like`);
  },
  
  // Save recipe
  save: (id) => {
    return apiClient.post(`/recipes/${id}/save`);
  },
  
  // Get saved recipes
  getSaved: () => {
    return apiClient.get('/recipes/saved');
  },
  
  // Get my recipes
  getMyRecipes: () => {
    return apiClient.get('/recipes/my/recipes');
  },
  
  // Search recipes
  search: (query, params = {}) => {
    return apiClient.get('/recipes/search', { 
      params: { q: query, ...params } 
    });
  },
  
  // Get trending recipes
  getTrending: (limit = 10) => {
    return apiClient.get('/recipes/trending', { params: { limit } });
  }
};