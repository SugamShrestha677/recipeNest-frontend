import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function MyRecipes() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Dummy recipes data for the authenticated user
  const dummyRecipes = [
    {
      _id: '1',
      title: 'Grandma\'s Apple Pie',
      description: 'A classic homemade apple pie with a flaky crust and sweet cinnamon filling.',
      image: 'https://images.unsplash.com/photo-1568571780765-9276ac8b75a7?ixlib=rb-4.0.3',
      prepTime: 30,
      cookTime: 45,
      servings: 8,
      difficulty: 'Medium',
      cuisine: 'American',
      createdAt: '2024-03-20T10:00:00Z',
      ingredients: [
        '6 cups apples, peeled and sliced',
        '1 cup granulated sugar',
        '2 tablespoons all-purpose flour',
        '1 teaspoon ground cinnamon',
        '1/4 teaspoon ground nutmeg',
        '1 tablespoon lemon juice',
        '2 tablespoons butter, cubed',
        '1 package refrigerated pie crusts (2 crusts)'
      ],
      instructions: [
        'Preheat oven to 425°F (220°C).',
        'In a large bowl, combine apples, sugar, flour, cinnamon, nutmeg, and lemon juice.',
        'Line a 9-inch pie plate with one pie crust.',
        'Fill with apple mixture and dot with butter.',
        'Top with second crust; seal and flute edges.',
        'Cut slits in top crust and brush with egg white.',
        'Bake for 15 minutes, then reduce to 350°F and bake for 35-40 minutes.'
      ]
    },
    {
      _id: '2',
      title: 'Spaghetti Carbonara',
      description: 'Authentic Italian pasta with eggs, cheese, and crispy pancetta.',
      image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?ixlib=rb-4.0.3',
      prepTime: 15,
      cookTime: 20,
      servings: 4,
      difficulty: 'Medium',
      cuisine: 'Italian',
      createdAt: '2024-03-18T14:30:00Z',
      ingredients: [
        '400g spaghetti',
        '4 large eggs',
        '100g pancetta, diced',
        '50g Pecorino Romano cheese',
        '50g Parmesan cheese',
        'Freshly ground black pepper'
      ],
      instructions: [
        'Cook pasta in salted water according to package instructions.',
        'While pasta cooks, fry pancetta until crispy.',
        'Whisk eggs, cheeses, and pepper in a bowl.',
        'Drain pasta and add to pancetta, remove from heat.',
        'Pour egg mixture over pasta and toss quickly until creamy.',
        'Serve immediately with extra cheese and pepper.'
      ]
    },
    {
      _id: '3',
      title: 'Chicken Tikka Masala',
      description: 'Creamy and flavorful Indian curry with grilled chicken.',
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3',
      prepTime: 20,
      cookTime: 35,
      servings: 6,
      difficulty: 'Hard',
      cuisine: 'Indian',
      createdAt: '2024-03-15T09:15:00Z',
      ingredients: [
        '500g chicken breast, cubed',
        '1 cup plain yogurt',
        '2 tablespoons garam masala',
        '1 tablespoon paprika',
        '1 large onion, chopped',
        '2 cups tomato puree',
        '1 cup heavy cream',
        'Fresh cilantro for garnish'
      ],
      instructions: [
        'Marinate chicken in yogurt and spices for 2 hours.',
        'Grill chicken until lightly charred.',
        'Sauté onions until golden brown.',
        'Add tomato puree and simmer for 10 minutes.',
        'Add cream and cooked chicken, simmer for 10 minutes.',
        'Garnish with cilantro and serve with rice or naan.'
      ]
    }
  ];

  const handleRecipeClick = (recipeId) => {
    console.log('Navigating to recipe with ID:', recipeId);
    navigate(`/recipes/${recipeId}`);
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty?.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const filteredRecipes = dummyRecipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.cuisine?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800">
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
              className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2 self-start"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New Recipe
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, description, or cuisine..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
            <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Recipes Grid */}
        {filteredRecipes.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No recipes yet</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {searchTerm 
                ? "No recipes match your search. Try a different term!" 
                : "Get started by creating your first recipe"}
            </p>
            {searchTerm ? (
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 text-orange-600 hover:text-orange-700 font-medium"
              >
                Clear search
              </button>
            ) : (
              <Link
                to="/recipes/create"
                className="inline-block mt-4 bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
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
                  onClick={() => handleRecipeClick(recipe._id)}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer group"
                >
                  {/* Image Container */}
                  <div className="relative h-56 overflow-hidden bg-gradient-to-br from-orange-200 to-red-200 dark:from-gray-700 dark:to-gray-600">
                    {recipe.image ? (
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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
                    
                    {/* Date Badge */}
                    <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-xs text-white">
                      {formatDate(recipe.createdAt)}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-orange-600 transition-colors">
                      {recipe.title}
                    </h3>
                    
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
                          <span>{recipe.prepTime + recipe.cookTime} min</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>{recipe.servings} servings</span>
                        </div>
                      </div>
                      
                      {recipe.cuisine && (
                        <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                          {recipe.cuisine}
                        </span>
                      )}
                    </div>
                    
                    {/* View Details Indicator */}
                    <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Click to view full recipe</span>
                        <svg className="w-4 h-4 text-orange-600 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Results Count */}
            <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredRecipes.length} {filteredRecipes.length === 1 ? 'recipe' : 'recipes'}
              {searchTerm && ` matching "${searchTerm}"`}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default MyRecipes;