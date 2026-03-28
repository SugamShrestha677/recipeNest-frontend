import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import apiClient from '../api/apiClient';
import toast from 'react-hot-toast';

function AuthenticatedHome() {
  const { user } = useContext(AuthContext);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalChefs: 0,
    totalRecipes: 0,
    totalLikes: 0
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch recipes from API
      const recipesResponse = await apiClient.get('/recipes', {
        params: {
          page: 1,
          limit: 6,
          sortBy: 'createdAt',
          sortOrder: 'desc'
        }
      });
      
      setRecipes(recipesResponse.data.recipes || []);
      
      // Fetch chefs count (you might need to add this endpoint)
      try {
        const chefsResponse = await apiClient.get('/chefs', {
          params: { limit: 1 }
        });
        setStats(prev => ({
          ...prev,
          totalChefs: chefsResponse.data.total || 0,
          totalRecipes: recipesResponse.data.total || 0
        }));
      } catch (err) {
        // If chefs endpoint doesn't exist yet, use dummy stats
        setStats({
          totalChefs: recipesResponse.data.total || 0,
          totalRecipes: recipesResponse.data.total || 0,
          totalLikes: 0
        });
      }
      
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.response?.data?.message || 'Failed to load recipes');
      toast.error('Failed to load recipes');
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty?.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const formatTime = (prepTime, cookTime) => {
    const total = (prepTime || 0) + (cookTime || 0);
    return `${total} min`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (error && recipes.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-lg">
            <p className="text-red-700 dark:text-red-400">{error}</p>
            <button
              onClick={fetchData}
              className="mt-2 text-red-600 hover:text-red-700 font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome, {user?.fullName?.split(' ')[0] || user?.name?.split(' ')[0] || 'Chef'}! 👨‍🍳
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Discover amazing recipes from fellow chefs around the world
              </p>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-linear-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Go to Dashboard
            </button>
          </div>
        </div>

        {/* Featured Recipes Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Featured Recipes from Our Chefs
          </h2>
          
          {recipes.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No recipes yet</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Be the first to share your culinary masterpiece!
              </p>
              <button
                onClick={() => navigate('/recipes/create')}
                className="mt-4 bg-linear-to-r from-orange-600 to-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Create Your First Recipe
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <div
                  key={recipe._id}
                  onClick={() => navigate(`/recipes/${recipe._id}`)}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer group"
                >
                  <div className="relative h-48 overflow-hidden bg-linear-to-br from-orange-200 to-red-200 dark:from-gray-700 dark:to-gray-600">
                    {recipe.image ? (
                      <img 
                        src={recipe.image} 
                        alt={recipe.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-6xl">🍳</span>
                      </div>
                    )}
                    
                    {/* Difficulty Badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getDifficultyColor(recipe.difficulty)}`}>
                        {recipe.difficulty || 'Medium'}
                      </span>
                    </div>
                    
                    {/* Likes Count */}
                    <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-xs text-white flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                      <span>{recipe.likes?.length || 0}</span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-orange-600 transition-colors">
                      {recipe.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                      {recipe.description || 'No description provided'}
                    </p>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>⏱️ {formatTime(recipe.prepTime, recipe.cookTime)}</span>
                        <span>👥 {recipe.servings || 4} servings</span>
                      </div>
                      {recipe.cuisine && (
                        <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                          {recipe.cuisine}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2">
                        {recipe.createdBy?.profilePicture ? (
                          <img
                            src={recipe.createdBy.profilePicture}
                            alt={recipe.createdBy.name}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-linear-to-r from-orange-500 to-red-500 flex items-center justify-center text-white text-xs">
                            {recipe.createdBy?.name?.charAt(0) || 'C'}
                          </div>
                        )}
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {recipe.createdBy?.name || 'Anonymous Chef'}
                        </span>
                      </div>
                      <svg className="w-4 h-4 text-orange-600 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center transform hover:scale-105 transition-all duration-300">
            <div className="text-3xl font-bold text-orange-600 mb-2">{stats.totalChefs}+</div>
            <div className="text-gray-600 dark:text-gray-400">Active Chefs</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center transform hover:scale-105 transition-all duration-300">
            <div className="text-3xl font-bold text-orange-600 mb-2">{stats.totalRecipes}+</div>
            <div className="text-gray-600 dark:text-gray-400">Recipes Shared</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center transform hover:scale-105 transition-all duration-300">
            <div className="text-3xl font-bold text-orange-600 mb-2">{stats.totalLikes || '1K'}+</div>
            <div className="text-gray-600 dark:text-gray-400">Food Lovers</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthenticatedHome;