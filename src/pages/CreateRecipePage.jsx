import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RecipeForm from '../components/RecipeForm';
import apiClient from '../api/apiClient';
import toast from 'react-hot-toast';

function CreateRecipePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      
      // apiClient already has the Authorization header
      const response = await apiClient.post('/recipes', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Recipe created:', response.data);
      toast.success('Recipe created successfully!');
      navigate('/my-recipes');
    } catch (error) {
      console.error('Creation error:', error);
      console.error('Error response:', error.response?.data);
      const message = error.response?.data?.message || 'Failed to create recipe';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Create a New Recipe
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Share your culinary masterpiece with the world
          </p>
        </div>
        
        <RecipeForm onSubmit={handleSubmit} isLoading={loading} />
      </div>
    </div>
  );
}

export default CreateRecipePage;