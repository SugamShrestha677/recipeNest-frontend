import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import toast from 'react-hot-toast';
import RecipeForm from '../components/RecipeForm';

function EditRecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const fetchRecipe = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/recipes/${id}`);
      setRecipe(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching recipe:', error);
      setError(error.response?.data?.message || 'Failed to load recipe');
      toast.error('Failed to load recipe');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setSaving(true);
      
      // For FormData (if image included)
      if (formData instanceof FormData) {
        await apiClient.put(`/recipes/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        // For regular JSON data
        await apiClient.put(`/recipes/${id}`, formData);
      }
      
      toast.success('Recipe updated successfully!');
      navigate('/my-recipes');
    } catch (error) {
      console.error('Error updating recipe:', error);
      const message = error.response?.data?.message || 'Failed to update recipe';
      toast.error(message);
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (error && !recipe) {
    return (
      <div className="min-h-screen bg-linear-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-lg">
            <p className="text-red-700 dark:text-red-400">{error}</p>
            <button
              onClick={() => navigate('/my-recipes')}
              className="mt-2 text-red-600 hover:text-red-700 font-medium"
            >
              Back to My Recipes
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Edit Recipe
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Update your culinary masterpiece
              </p>
            </div>
            <button
              onClick={() => navigate('/my-recipes')}
              className="text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
            >
              ← Back to My Recipes
            </button>
          </div>
        </div>
        
        <RecipeForm 
          onSubmit={handleSubmit} 
          initialValues={recipe}
          isEditing={true}
          isLoading={saving}
        />
      </div>
    </div>
  );
}

export default EditRecipePage;