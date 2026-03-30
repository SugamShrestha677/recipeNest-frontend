import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import apiClient from '../api/apiClient';
import toast from 'react-hot-toast';

function SavedRecipes() {
  const { user } = useContext(AuthContext);
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [unsaveLoading, setUnsaveLoading] = useState(null);
  const navigate = useNavigate();
  const IMAGE_BASE_URL = "http://localhost:5000";

  useEffect(() => {
    fetchSavedRecipes();
  }, []);

  const fetchSavedRecipes = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await apiClient.get('/recipes/saved');
      setRecipes(response.data.recipes || []);
    } catch (error) {
      console.error('Error fetching saved recipes:', error);
      setError(error.response?.data?.message || 'Failed to load saved recipes');
      toast.error('Failed to load saved recipes');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (recipeId, recipeTitle) => {
    if (!window.confirm(`Remove "${recipeTitle}" from your saved recipes?`)) {
      return;
    }

    try {
      setUnsaveLoading(recipeId);
      const response = await apiClient.post(`/recipes/${recipeId}/save`);
      
      if (!response.data.saved) {
        // Remove from state
        setRecipes(recipes.filter(recipe => recipe._id !== recipeId));
        toast.success('Recipe removed from saved collection');
      }
    } catch (error) {
      console.error('Error unsaving recipe:', error);
      toast.error(error.response?.data?.message || 'Failed to remove recipe');
    } finally {
      setUnsaveLoading(null);
    }
  };

  const handleRecipeClick = (recipeId) => {
    navigate(`/recipes/${recipeId}`);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'hard':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recent';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (prepTime, cookTime) => {
    const total = (prepTime || 0) + (cookTime || 0);
    return `${total} min`;
  };

  // Filter recipes based on search term
  const filteredRecipes = recipes.filter(
    (recipe) =>
      recipe.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.cuisine?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.tags?.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Saved Recipes
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Your collection of saved recipes for inspiration
              </p>
            </div>
            <Link
              to="/recipes"
              className="bg-linear-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2 self-start"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Discover More Recipes
            </Link>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-lg mb-8">
            <div className="flex items-center justify-between">
              <p className="text-red-700 dark:text-red-400">{error}</p>
              <button
                onClick={fetchSavedRecipes}
                className="text-red-600 hover:text-red-700 font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Search Bar */}
        {recipes.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search saved recipes by title, cuisine, or tags..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <svg
                className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Recipes Grid */}
        {filteredRecipes.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
            {searchTerm ? (
              <>
                <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No matching saved recipes</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  No saved recipes match "{searchTerm}". Try a different search term.
                </p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-4 text-orange-600 hover:text-orange-700 font-medium"
                >
                  Clear search
                </button>
              </>
            ) : (
              <>
                <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No saved recipes yet</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Start saving recipes you love! Click the bookmark icon on any recipe to add it to your collection.
                </p>
                <Link
                  to="/recipes"
                  className="inline-block mt-4 bg-linear-to-r from-orange-600 to-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Browse Recipes
                </Link>
              </>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecipes.map((recipe) => (
                <div
                  key={recipe._id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group"
                >
                  {/* Image Container */}
                  <div
                    onClick={() => handleRecipeClick(recipe._id)}
                    className="relative h-56 overflow-hidden bg-linear-to-br from-orange-200 to-red-200 dark:from-gray-700 dark:to-gray-600 cursor-pointer"
                  >
                    {recipe.image ? (
                      <img
                        src={`${IMAGE_BASE_URL}${recipe.image}`}
                        alt={recipe.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = '<div class="flex items-center justify-center h-full"><span class="text-6xl">🍳</span></div>';
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <span className="text-6xl">🍳</span>
                      </div>
                    )}

                    {/* Difficulty Badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(recipe.difficulty)}`}>
                        {recipe.difficulty || 'Medium'}
                      </span>
                    </div>

                    {/* Saved Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                        Saved
                      </span>
                    </div>

                    {/* Stats Badge */}
                    <div className="absolute bottom-3 right-3 flex gap-1">
                      <div className="bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-xs text-white flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                        <span>{recipe.likes?.length || 0}</span>
                      </div>
                      <div className="bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-xs text-white flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>{recipe.views || 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3
                        onClick={() => handleRecipeClick(recipe._id)}
                        className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-orange-600 transition-colors cursor-pointer flex-1"
                      >
                        {recipe.title}
                      </h3>

                      {/* Unsave Button */}
                      <button
                        onClick={() => handleUnsave(recipe._id, recipe.title)}
                        disabled={unsaveLoading === recipe._id}
                        className="p-1 text-orange-500 hover:text-red-600 transition-colors disabled:opacity-50"
                        title="Remove from saved"
                      >
                        {unsaveLoading === recipe._id ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-600"></div>
                        ) : (
                          <svg className="w-5 h-5" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                          </svg>
                        )}
                      </button>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                      {recipe.description || 'No description provided'}
                    </p>

                    {/* Recipe Metadata */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{formatTime(recipe.prepTime, recipe.cookTime)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>{recipe.servings || 4} servings</span>
                        </div>
                      </div>
                      {recipe.cuisine && (
                        <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                          {recipe.cuisine}
                        </span>
                      )}
                    </div>

                    {/* Tags */}
                    {recipe.tags && recipe.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {recipe.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                        {recipe.tags.length > 3 && (
                          <span className="text-xs text-gray-500">+{recipe.tags.length - 3}</span>
                        )}
                      </div>
                    )}

                    {/* Chef Info */}
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
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
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {recipe.createdBy?.name || 'Anonymous Chef'}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">{formatDate(recipe.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Results Count */}
            <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredRecipes.length} {filteredRecipes.length === 1 ? 'saved recipe' : 'saved recipes'}
              {searchTerm && ` matching "${searchTerm}"`}
              {recipes.length > 0 && ` out of ${recipes.length} total`}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SavedRecipes;