import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
const API = import.meta.env.VITE_API_BASE_URL;
import apiClient from '../../api/apiClient';

function FeaturedRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    fetchFeaturedRecipes();
  }, []);

  const fetchFeaturedRecipes = async () => {
    try {
      // const response = await axios.get('/api/recipes?limit=6');
      const response = await apiClient.get('/recipes?limit=6');
      setRecipes(response.data.recipes || []);
    } catch (error) {
      console.error('Failed to fetch recipes:', error);
      // Mock data for demo
      setRecipes([
        { _id: 1, title: "Truffle Risotto", description: "Creamy Arborio rice with black truffle", difficulty: "Expert", prepTime: 15, cookTime: 30, image: "https://images.unsplash.com/photo-1633964911435-c903d7c9d6af?w=500", chefId: { fullName: "Chef Sofia" } },
        { _id: 2, title: "Spicy Ramen", description: "Rich broth, noodles, and perfect egg", difficulty: "Medium", prepTime: 20, cookTime: 40, image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500", chefId: { fullName: "Chef Kenji" } },
        { _id: 3, title: "Berry Pavlova", description: "Crispy meringue, fresh berries", difficulty: "Hard", prepTime: 30, cookTime: 90, image: "https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=500", chefId: { fullName: "Chef Emma" } },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Featured Recipes</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Discover culinary masterpieces from top chefs</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-700 rounded-2xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-56 bg-gray-300 dark:bg-gray-600"></div>
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="py-20 bg-gray-50 dark:bg-gray-800/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold bg-linear-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Featured Recipes
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-3 text-lg">Discover culinary masterpieces from top chefs 🔥</p>
        </motion.div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {recipes.slice(0, 6).map((recipe) => (
            <motion.div
              key={recipe._id}
              variants={cardVariants}
              whileHover={{ y: -10 }}
              onMouseEnter={() => setHoveredId(recipe._id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <Link
                to={`/recipes/${recipe._id}`}
                className="block bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden group relative"
              >
                <div className="relative h-56 overflow-hidden">
                  <motion.img
                    src={recipe.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500"}
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                    animate={{ scale: hoveredId === recipe._id ? 1.1 : 1 }}
                    transition={{ duration: 0.4 }}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: hoveredId === recipe._id ? 1 : 0, x: hoveredId === recipe._id ? 0 : 20 }}
                    className="absolute top-3 right-3 bg-linear-to-r from-orange-600 to-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"
                  >
                    {recipe.difficulty || 'Easy'}
                  </motion.div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                    {recipe.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                    {recipe.description || 'A delicious recipe worth trying!'}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-orange-600 dark:text-orange-400 font-medium">
                      👩‍🍳 {recipe.chefId?.fullName || 'Professional Chef'}
                    </span>
                    <span className="text-gray-500 flex items-center gap-1">
                      ⏱️ {recipe.prepTime + recipe.cookTime} min
                    </span>
                  </div>
                </div>
                
                {/* Hover overlay effect */}
                <motion.div
                  className="absolute inset-0 bg-linear-to-r from-orange-500/10 to-red-500/10 rounded-2xl pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredId === recipe._id ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            to="/recipes"
            className="group inline-flex items-center gap-2 bg-linear-to-r from-orange-600 to-red-600 text-white px-10 py-3 rounded-full font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            View All Recipes
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default FeaturedRecipes;