import React, { useState, useEffect,useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

function AuthenticatedHome() {
  const { user } = useContext(AuthContext);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Dummy recipes from other chefs
  const chefsRecipes = [
    {
      _id: '1',
      title: 'Grandma\'s Apple Pie',
      description: 'A classic homemade apple pie with a flaky crust and sweet cinnamon filling.',
      image: 'https://images.unsplash.com/photo-1568571780765-9276ac8b75a7',
      prepTime: 30,
      cookTime: 45,
      difficulty: 'Medium',
      chef: 'Chef Maria Rodriguez',
      chefId: 'chef1'
    },
    {
      _id: '2',
      title: 'Spaghetti Carbonara',
      description: 'Authentic Italian pasta with eggs, cheese, and crispy pancetta.',
      image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3',
      prepTime: 15,
      cookTime: 20,
      difficulty: 'Medium',
      chef: 'Chef David Chen',
      chefId: 'chef2'
    },
    {
      _id: '3',
      title: 'Chicken Tikka Masala',
      description: 'Creamy and flavorful Indian curry with grilled chicken.',
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641',
      prepTime: 20,
      cookTime: 35,
      difficulty: 'Hard',
      chef: 'Chef Sarah Johnson',
      chefId: 'chef3'
    },
    {
      _id: '4',
      title: 'Fresh Sushi Roll',
      description: 'Fresh and delicious sushi rolls with salmon and avocado.',
      image: 'https://images.unsplash.com/photo-1553621042-f6e147245754',
      prepTime: 40,
      cookTime: 10,
      difficulty: 'Hard',
      chef: 'Chef Hiroshi Tanaka',
      chefId: 'chef4'
    },
    {
      _id: '5',
      title: 'Mediterranean Bowl',
      description: 'Healthy bowl with quinoa, roasted vegetables, and tahini dressing.',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
      prepTime: 20,
      cookTime: 25,
      difficulty: 'Easy',
      chef: 'Chef Elena Garcia',
      chefId: 'chef5'
    }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setRecipes(chefsRecipes);
      setLoading(false);
    }, 500);
  }, []);

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
        
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome, {user?.fullName?.split(' ')[0] || 'Chef'}! 👨‍🍳
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <div
                key={recipe._id}
                onClick={() => navigate(`/recipes/${recipe._id}`)}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer group"
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={recipe.image} 
                    alt={recipe.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {recipe.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                    {recipe.description}
                  </p>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getDifficultyColor(recipe.difficulty)}`}>
                      {recipe.difficulty}
                    </span>
                    <span className="text-xs text-gray-500">
                      ⏱️ {recipe.prepTime + recipe.cookTime} min
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-linear-to-r from-orange-500 to-red-500 flex items-center justify-center text-white text-xs">
                        {recipe.chef.charAt(0)}
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {recipe.chef}
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
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">50+</div>
            <div className="text-gray-600 dark:text-gray-400">Active Chefs</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">100+</div>
            <div className="text-gray-600 dark:text-gray-400">Recipes Shared</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">1K+</div>
            <div className="text-gray-600 dark:text-gray-400">Food Lovers</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthenticatedHome;