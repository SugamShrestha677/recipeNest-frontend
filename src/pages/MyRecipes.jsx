import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import apiClient from "../api/apiClient";
import toast from "react-hot-toast";

function MyRecipes() {
  const { user } = useContext(AuthContext);
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  const navigate = useNavigate();
  
  // Separate base URLs for API and images
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
  const IMAGE_BASE_URL = "http://localhost:5000"; // Direct server URL for images

  useEffect(() => {
    fetchMyRecipes();
  }, []);

  const fetchMyRecipes = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await apiClient.get("/recipes/my/recipes");
      setRecipes(response.data.recipes || []);
    } catch (error) {
      console.error("Error fetching my recipes:", error);
      setError(error.response?.data?.message || "Failed to load your recipes");
      toast.error("Failed to load your recipes");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRecipe = async (recipeId, recipeTitle) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${recipeTitle}"? This action cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      setDeleteLoading(recipeId);
      await apiClient.delete(`/recipes/${recipeId}`);
      setRecipes(recipes.filter((recipe) => recipe._id !== recipeId));
      toast.success("Recipe deleted successfully");
    } catch (error) {
      console.error("Error deleting recipe:", error);
      toast.error(error.response?.data?.message || "Failed to delete recipe");
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleRecipeClick = (recipeId) => {
    navigate(`/recipes/${recipeId}`);
  };

  const handleImageError = (recipeId) => {
    setImageErrors((prev) => ({ ...prev, [recipeId]: true }));
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Recent";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (prepTime, cookTime) => {
    const total = (prepTime || 0) + (cookTime || 0);
    return `${total} min`;
  };

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
                My Recipes
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage and organize your culinary creations
              </p>
            </div>
            <Link
              to="/recipes/create"
              className="bg-linear-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2 self-start"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create New Recipe
            </Link>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-lg mb-8">
            <div className="flex items-center justify-between">
              <p className="text-red-700 dark:text-red-400">{error}</p>
              <button
                onClick={fetchMyRecipes}
                className="text-red-600 hover:text-red-700 font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, description, cuisine, or tags..."
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
                onClick={() => setSearchTerm("")}
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

        {/* Recipes Grid */}
        {filteredRecipes.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
            <svg
              className="mx-auto h-16 w-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              {searchTerm ? "No matching recipes found" : "No recipes yet"}
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {searchTerm
                ? "No recipes match your search. Try a different term!"
                : "Get started by creating your first recipe"}
            </p>
            {searchTerm ? (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-4 text-orange-600 hover:text-orange-700 font-medium"
              >
                Clear search
              </button>
            ) : (
              <Link
                to="/recipes/create"
                className="inline-block mt-4 bg-linear-to-r from-orange-600 to-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Create Your First Recipe
              </Link>
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
                    {recipe.image && !imageErrors[recipe._id] ? (
                      <img
                        src={`${IMAGE_BASE_URL}${recipe.image}`}
                        alt={recipe.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={() => handleImageError(recipe._id)}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <span className="text-6xl">🍳</span>
                      </div>
                    )}

                    {/* Difficulty Badge */}
                    <div className="absolute top-3 left-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(recipe.difficulty)}`}
                      >
                        {recipe.difficulty || "Medium"}
                      </span>
                    </div>

                    {/* Date Badge */}
                    <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-xs text-white">
                      {formatDate(recipe.createdAt)}
                    </div>

                    {/* Stats Badge */}
                    <div className="absolute top-3 right-3 flex gap-1">
                      <div className="bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-xs text-white flex items-center gap-1">
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>{recipe.likes?.length || 0}</span>
                      </div>
                      <div className="bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-xs text-white flex items-center gap-1">
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        <span>{recipe.views || 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* Rest of the content remains the same... */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3
                        onClick={() => handleRecipeClick(recipe._id)}
                        className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-orange-600 transition-colors cursor-pointer flex-1"
                      >
                        {recipe.title}
                      </h3>
                      <div className="flex gap-2 ml-2">
                        <button
                          onClick={() => navigate(`/recipes/edit/${recipe._id}`)}
                          className="p-1 text-gray-500 hover:text-orange-600 transition-colors"
                          title="Edit recipe"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteRecipe(recipe._id, recipe.title)}
                          disabled={deleteLoading === recipe._id}
                          className="p-1 text-gray-500 hover:text-red-600 transition-colors disabled:opacity-50"
                          title="Delete recipe"
                        >
                          {deleteLoading === recipe._id ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                      {recipe.description || "No description provided"}
                    </p>
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
                    {recipe.tags && recipe.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {recipe.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded">
                            #{tag}
                          </span>
                        ))}
                        {recipe.tags.length > 3 && (
                          <span className="text-xs text-gray-500">+{recipe.tags.length - 3}</span>
                        )}
                      </div>
                    )}
                    <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Click image to view full recipe</span>
                        <svg className="w-4 h-4 text-orange-600 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredRecipes.length} {filteredRecipes.length === 1 ? "recipe" : "recipes"}
              {searchTerm && ` matching "${searchTerm}"`}
              {recipes.length > 0 && ` out of ${recipes.length} total`}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default MyRecipes;