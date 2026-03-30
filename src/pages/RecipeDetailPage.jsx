import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import apiClient from '../api/apiClient';
import toast from 'react-hot-toast';

function RecipeDetailPage() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('ingredients');
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Like and Save states
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [saved, setSaved] = useState(false);
  const [savesCount, setSavesCount] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  
  const IMAGE_BASE_URL = "http://localhost:5000"; // Direct server URL for images

  useEffect(() => {
    let isActive = true;
    const fetchRecipe = async () => {
      try {
        const res = await apiClient.get(`/recipes/${id}`);
        if (isActive) {
          setRecipe(res.data);
          setLikesCount(res.data.likes?.length || 0);
          setSavesCount(res.data.saves?.length || 0);
          
          // Check if user liked/saved this recipe
          if (user) {
            setLiked(res.data.likes?.includes(user.id));
            setSaved(res.data.saves?.includes(user.id));
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load recipe');
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };
    fetchRecipe();
    return () => {
      isActive = false;
    };
  }, [id, user]);

  // Handle Like/Unlike
  const handleLike = async () => {
    if (!user) {
      toast.error('Please login to like recipes');
      return;
    }

    try {
      setLikeLoading(true);
      const response = await apiClient.post(`/recipes/${id}/like`);
      setLiked(response.data.liked);
      setLikesCount(response.data.likesCount);
      toast.success(response.data.message);
    } catch (error) {
      console.error('Error liking recipe:', error);
      toast.error(error.response?.data?.message || 'Failed to like recipe');
    } finally {
      setLikeLoading(false);
    }
  };

  // Handle Save/Unsave
  const handleSave = async () => {
    if (!user) {
      toast.error('Please login to save recipes');
      return;
    }

    try {
      setSaveLoading(true);
      const response = await apiClient.post(`/recipes/${id}/save`);
      setSaved(response.data.saved);
      setSavesCount(response.data.savesCount);
      toast.success(response.data.message);
    } catch (error) {
      console.error('Error saving recipe:', error);
      toast.error(error.response?.data?.message || 'Failed to save recipe');
    } finally {
      setSaveLoading(false);
    }
  };

  // Handle Share
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Recipe link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 border-4 border-orange-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-orange-500 rounded-full animate-spin border-t-transparent"></div>
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-300 text-lg">Loading your delicious recipe...</p>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Recipe Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error || 'The recipe you\'re looking for doesn\'t exist'}</p>
          <Link
            to="/recipes"
            className="inline-flex items-center gap-2 bg-linear-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Browse All Recipes
          </Link>
        </motion.div>
      </div>
    );
  }

  // Calculate total time
  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);
  const defaultImage = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800";

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section with Image */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-linear-to-r from-orange-200 to-red-200 animate-pulse"></div>
          )}
          <img
            src={`${IMAGE_BASE_URL}${recipe.image}`}
            alt={recipe.title}
            className={`w-full h-full object-contain transition-opacity duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = '<div class="w-full h-full bg-linear-to-r from-orange-200 to-red-200 flex items-center justify-center"><span class="text-6xl">🍳</span></div>';
            }}
          />
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent"></div>
        </div>

        {/* Back Button */}
        <Link
          to="/recipes"
          className="absolute top-6 left-6 z-20 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full p-2 hover:scale-110 transition-transform duration-300 shadow-lg"
        >
          <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>

        {/* Like and Save Buttons (Top Right) */}
        <div className="absolute top-6 right-6 z-20 flex gap-3">
          {/* Like Button */}
          <button
            onClick={handleLike}
            disabled={likeLoading}
            className={`group flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
              liked
                ? 'bg-red-500 text-white shadow-lg'
                : 'bg-white/90 dark:bg-gray-900/90 text-gray-700 dark:text-gray-300 hover:bg-red-500 hover:text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {likeLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
            ) : (
              <svg className="w-5 h-5" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            )}
            <span className="text-sm font-medium">{likesCount}</span>
          </button>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saveLoading}
            className={`group flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
              saved
                ? 'bg-orange-500 text-white shadow-lg'
                : 'bg-white/90 dark:bg-gray-900/90 text-gray-700 dark:text-gray-300 hover:bg-orange-500 hover:text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {saveLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
            ) : (
              <svg className="w-5 h-5" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            )}
            <span className="text-sm font-medium">{savesCount}</span>
          </button>
        </div>

        {/* Recipe Title and Meta */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 text-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-wrap gap-2 mb-4">
                {recipe.tags?.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">{recipe.title}</h1>
              <p className="text-lg md:text-xl text-white/90 max-w-3xl">{recipe.description}</p>
              
              {/* Recipe Stats */}
              <div className="flex flex-wrap gap-6 mt-6">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{totalTime} min</span>
                </div>
                {recipe.difficulty && (
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="capitalize">{recipe.difficulty}</span>
                  </div>
                )}
                {recipe.servings && (
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>{recipe.servings} servings</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Chef Info */}
        {recipe.createdBy && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4 mb-12 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg"
          >
            <div className="w-16 h-16 bg-linear-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-2xl">
              👨‍🍳
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Created by</p>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {recipe.createdBy.name || 'Professional Chef'}
              </h3>
              {recipe.createdBy.bio && (
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">{recipe.createdBy.bio}</p>
              )}
            </div>
          </motion.div>
        )}

        {/* Tab Navigation */}
        <div className="mb-8 border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-8">
            {[
              { id: 'ingredients', label: 'Ingredients', icon: '🥗' },
              { id: 'steps', label: 'Instructions', icon: '👩‍🍳' },
              { id: 'nutrition', label: 'Nutrition', icon: '📊' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 px-2 font-semibold transition-all duration-300 relative ${
                  activeTab === tab.id
                    ? 'text-orange-600 dark:text-orange-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-orange-600 to-red-600"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'ingredients' && (
            <motion.div
              key="ingredients"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <span>📝</span> Ingredients
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recipe.ingredients?.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-700 transition-colors group"
                  >
                    <div className="w-6 h-6 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform">
                      ✓
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'steps' && (
            <motion.div
              key="steps"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <span>🔪</span> Instructions
              </h2>
              <div className="space-y-6">
                {recipe.steps?.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4 group"
                  >
                    <div className="shrink-0 w-10 h-10 bg-linear-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                      {index + 1}
                    </div>
                    <div className="flex-1 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 group-hover:bg-orange-50 dark:group-hover:bg-gray-700 transition-colors">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{step}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'nutrition' && (
            <motion.div
              key="nutrition"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <span>📊</span> Nutrition Information
              </h2>
              {recipe.nutrition ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(recipe.nutrition).map(([key, value]) => (
                    <div key={key} className="text-center p-4 bg-linear-to-br from-orange-50 to-red-50 dark:from-gray-700 dark:to-gray-600 rounded-xl">
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{value}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300 capitalize mt-1">{key}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📊</div>
                  <p className="text-gray-500 dark:text-gray-400">Nutrition information coming soon!</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tags Section */}
        {recipe.tags && recipe.tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Related Tags</h3>
            <div className="flex flex-wrap gap-3">
              {recipe.tags.map((tag) => (
                <Link
                  key={tag}
                  to={`/recipes?tag=${tag}`}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-orange-100 dark:hover:bg-orange-900/30 hover:text-orange-600 dark:hover:text-orange-400 transition-all duration-300 hover:scale-105"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 flex flex-wrap gap-4 justify-center"
        >
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-orange-600 to-red-600 text-white rounded-full font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share Recipe
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export default RecipeDetailPage;