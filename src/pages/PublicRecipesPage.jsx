import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/apiClient';
import toast from 'react-hot-toast';

function PublicRecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  // Dummy recipes data for public view
  const dummyRecipes = [
    {
      _id: '1',
      title: 'Grandma\'s Apple Pie',
      description: 'A classic homemade apple pie with a flaky crust and sweet cinnamon filling. Perfect for any occasion!',
      image: 'https://images.unsplash.com/photo-1568571780765-9276ac8b75a7?ixlib=rb-4.0.3',
      prepTime: 30,
      cookTime: 45,
      servings: 8,
      difficulty: 'Medium',
      cuisine: 'American',
      chefName: 'Chef Maria Rodriguez',
      chefId: 'chef1',
      createdAt: '2024-03-20T10:00:00Z',
      likes: 1245,
      views: 5678
    },
    {
      _id: '2',
      title: 'Spaghetti Carbonara',
      description: 'Authentic Italian pasta with eggs, cheese, and crispy pancetta. Rich, creamy, and absolutely delicious!',
      image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?ixlib=rb-4.0.3',
      prepTime: 15,
      cookTime: 20,
      servings: 4,
      difficulty: 'Medium',
      cuisine: 'Italian',
      chefName: 'Chef David Chen',
      chefId: 'chef2',
      createdAt: '2024-03-18T14:30:00Z',
      likes: 892,
      views: 3456
    },
    {
      _id: '3',
      title: 'Chicken Tikka Masala',
      description: 'Creamy and flavorful Indian curry with grilled chicken. A restaurant-quality dish made at home!',
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3',
      prepTime: 20,
      cookTime: 35,
      servings: 6,
      difficulty: 'Hard',
      cuisine: 'Indian',
      chefName: 'Chef Sarah Johnson',
      chefId: 'chef3',
      createdAt: '2024-03-15T09:15:00Z',
      likes: 2103,
      views: 8901
    },
    {
      _id: '4',
      title: 'Fresh Sushi Roll',
      description: 'Fresh and delicious sushi rolls with salmon and avocado. Perfect for sushi lovers!',
      image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?ixlib=rb-4.0.3',
      prepTime: 40,
      cookTime: 10,
      servings: 4,
      difficulty: 'Hard',
      cuisine: 'Japanese',
      chefName: 'Chef Hiroshi Tanaka',
      chefId: 'chef4',
      createdAt: '2024-03-12T11:20:00Z',
      likes: 1567,
      views: 6789
    },
    {
      _id: '5',
      title: 'Mediterranean Bowl',
      description: 'Healthy bowl with quinoa, roasted vegetables, and tahini dressing. Vegan and gluten-free option available.',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3',
      prepTime: 20,
      cookTime: 25,
      servings: 2,
      difficulty: 'Easy',
      cuisine: 'Mediterranean',
      chefName: 'Chef Elena Garcia',
      chefId: 'chef5',
      createdAt: '2024-03-10T16:45:00Z',
      likes: 734,
      views: 2345
    },
    {
      _id: '6',
      title: 'Beef Wellington',
      description: 'Classic British dish with beef tenderloin wrapped in puff pastry. Perfect for special occasions!',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3',
      prepTime: 45,
      cookTime: 45,
      servings: 6,
      difficulty: 'Hard',
      cuisine: 'British',
      chefName: 'Chef James Wilson',
      chefId: 'chef6',
      createdAt: '2024-03-08T13:10:00Z',
      likes: 2456,
      views: 9876
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setRecipes(dummyRecipes);
      setLoading(false);
    }, 800);
  }, []);

  const cuisines = ['all', 'American', 'Italian', 'Indian', 'Japanese', 'Mediterranean', 'British'];
  const difficulties = ['all', 'Easy', 'Medium', 'Hard'];

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.chefName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCuisine = selectedCuisine === 'all' || recipe.cuisine === selectedCuisine;
    const matchesDifficulty = selectedDifficulty === 'all' || recipe.difficulty === selectedDifficulty;
    return matchesSearch && matchesCuisine && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Hard': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
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
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Discover Amazing Recipes
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Explore culinary masterpieces from professional chefs around the world
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by title, description, or chef name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Filter Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cuisine Type
              </label>
              <select
                value={selectedCuisine}
                onChange={(e) => setSelectedCuisine(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
              >
                {cuisines.map(cuisine => (
                  <option key={cuisine} value={cuisine}>
                    {cuisine === 'all' ? 'All Cuisines' : cuisine}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Difficulty Level
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty === 'all' ? 'All Difficulties' : difficulty}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-gray-600 dark:text-gray-400">
          Found {filteredRecipes.length} {filteredRecipes.length === 1 ? 'recipe' : 'recipes'}
        </div>

        {/* Recipes Grid */}
        {filteredRecipes.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No recipes found</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Try adjusting your search or filters to find what you're looking for
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCuisine('all');
                setSelectedDifficulty('all');
              }}
              className="mt-4 text-orange-600 hover:text-orange-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <Link
                key={recipe._id}
                to={`/recipes/${recipe._id}`}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getDifficultyColor(recipe.difficulty)}`}>
                      {recipe.difficulty}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-xs text-white">
                    ⏱️ {recipe.prepTime + recipe.cookTime} min
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                    {recipe.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                    {recipe.description}
                  </p>
                  
                  {/* Chef Info */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white text-xs">
                        {recipe.chefName.charAt(0)}
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {recipe.chefName}
                      </span>
                    </div>
                    <span className="text-xs text-orange-600 dark:text-orange-400">
                      {recipe.cuisine}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>❤️ {recipe.likes}</span>
                      <span>👁️ {recipe.views}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(recipe.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Call to Action for Unauthenticated Users */}
        <div className="mt-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Want to Share Your Own Recipes?</h2>
          <p className="mb-4">Join RecipeNest today and become part of our culinary community!</p>
          <Link
            to="/register"
            className="inline-block bg-white text-orange-600 px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Sign Up Now
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PublicRecipesPage;