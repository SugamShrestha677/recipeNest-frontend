import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function FeaturedRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedRecipes();
  }, []);

  const fetchFeaturedRecipes = async () => {
    try {
      const response = await axios.get('/api/recipes?limit=6');
      setRecipes(response.data.recipes || []);
    } catch (error) {
      console.error('Failed to fetch recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Featured Recipes</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Discover culinary masterpieces from top chefs</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-300 dark:bg-gray-600"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (recipes.length === 0) {
    return null;
  }

  return (
    <div className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Featured Recipes</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Discover culinary masterpieces from top chefs</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipes.slice(0, 6).map((recipe) => (
            <Link
              key={recipe._id}
              to={`/recipes/${recipe._id}`}
              className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
            >
              <div className="relative h-48 overflow-hidden">
                {recipe.image ? (
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-orange-200 to-red-200 flex items-center justify-center">
                    <span className="text-4xl">🍳</span>
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-linear-to-r from-orange-600 to-red-600 text-white px-2 py-1 rounded text-xs">
                  {recipe.difficulty || 'Easy'}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
                  {recipe.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                  {recipe.description || 'A delicious recipe worth trying!'}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-orange-600 dark:text-orange-400">
                    By {recipe.chefId?.fullName || 'Professional Chef'}
                  </span>
                  <span className="text-gray-500">
                    ⏱️ {recipe.prepTime + recipe.cookTime} min
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link
            to="/recipes"
            className="inline-block bg-linear-to-r from-orange-600 to-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
          >
            View All Recipes
          </Link>
        </div>
      </div>
    </div>
  );
}

export default FeaturedRecipes;