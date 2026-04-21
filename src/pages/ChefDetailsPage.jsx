import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import apiClient from '../api/apiClient';

const IMAGE_BASE_URL = 'http://localhost:5000';
const DEFAULT_AVATAR = 'https://randomuser.me/api/portraits/lego/1.jpg';
const DEFAULT_RECIPE_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800';

function normalizeImageUrl(image, fallback = DEFAULT_AVATAR) {
  if (!image) {
    return fallback;
  }

  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image;
  }

  return `${IMAGE_BASE_URL}${image}`;
}

function ChefDetailsPage() {
  const { id } = useParams();
  const [chef, setChef] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isActive = true;

    const fetchChefDetails = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await apiClient.get('/recipes', {
          params: {
            page: 1,
            limit: 100,
            sortBy: 'createdAt',
            sortOrder: 'desc'
          }
        });

        const allRecipes = response.data?.recipes || [];
        const chefRecipes = allRecipes.filter((recipe) => recipe.createdBy?._id === id);

        if (!isActive) {
          return;
        }

        if (chefRecipes.length === 0) {
          setChef(null);
          setRecipes([]);
          setError('Chef profile not found or no public recipes available yet.');
          return;
        }

        const profile = chefRecipes[0].createdBy;
        const totalViews = chefRecipes.reduce((sum, recipe) => sum + (recipe.views || 0), 0);
        const totalLikes = chefRecipes.reduce((sum, recipe) => sum + (recipe.likes?.length || 0), 0);

        setChef({
          _id: profile._id,
          name: profile.name || 'Unknown Chef',
          specialty: profile.specialty || 'General Cuisine',
          bio: profile.bio || 'Passionate chef sharing delicious recipes.',
          location: profile.location || 'Location not specified',
          experience: profile.experience || 0,
          image: normalizeImageUrl(profile.profilePicture, DEFAULT_AVATAR),
          followers: Array.isArray(profile.followers) ? profile.followers.length : 0,
          recipeCount: chefRecipes.length,
          totalViews,
          totalLikes
        });

        setRecipes(chefRecipes);
      } catch (err) {
        if (isActive) {
          setError(err.response?.data?.message || 'Unable to load chef details right now.');
          setChef(null);
          setRecipes([]);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    fetchChefDetails();

    return () => {
      isActive = false;
    };
  }, [id]);

  const featuredRecipes = useMemo(() => recipes.slice(0, 6), [recipes]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (error || !chef) {
    return (
      <div className="min-h-screen bg-linear-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800 py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-10 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Chef Details Unavailable</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error || 'Unable to load this chef profile.'}</p>
            <Link
              to="/chefs"
              className="inline-block bg-linear-to-r from-orange-600 to-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Back to Chefs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link to="/chefs" className="text-orange-600 hover:text-orange-700 font-medium">
            Back to chefs
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <img
              src={chef.image}
              alt={chef.name}
              className="w-36 h-36 rounded-full object-cover border-4 border-orange-500"
              onError={(e) => {
                e.currentTarget.src = DEFAULT_AVATAR;
              }}
            />

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{chef.name}</h1>
              <p className="text-orange-600 dark:text-orange-400 font-semibold mb-2">{chef.specialty}</p>
              <p className="text-gray-600 dark:text-gray-400 mb-3">{chef.location}</p>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl">{chef.bio}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-orange-50 dark:bg-gray-700 rounded-lg p-3">
                  <div className="text-xl font-bold text-gray-900 dark:text-white">{chef.recipeCount}</div>
                  <div className="text-xs text-gray-500">Recipes</div>
                </div>
                <div className="bg-orange-50 dark:bg-gray-700 rounded-lg p-3">
                  <div className="text-xl font-bold text-gray-900 dark:text-white">{chef.experience}+</div>
                  <div className="text-xs text-gray-500">Years</div>
                </div>
                <div className="bg-orange-50 dark:bg-gray-700 rounded-lg p-3">
                  <div className="text-xl font-bold text-gray-900 dark:text-white">{chef.totalLikes}</div>
                  <div className="text-xs text-gray-500">Total Likes</div>
                </div>
                <div className="bg-orange-50 dark:bg-gray-700 rounded-lg p-3">
                  <div className="text-xl font-bold text-gray-900 dark:text-white">{chef.totalViews}</div>
                  <div className="text-xs text-gray-500">Total Views</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recipes by {chef.name}</h2>
          <span className="text-sm text-gray-600 dark:text-gray-400">{recipes.length} total</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredRecipes.map((recipe) => (
            <Link
              key={recipe._id}
              to={`/recipes/${recipe._id}`}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group"
            >
              <div className="h-44 overflow-hidden">
                <img
                  src={normalizeImageUrl(recipe.image, DEFAULT_RECIPE_IMAGE)}
                  alt={recipe.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.src = DEFAULT_RECIPE_IMAGE;
                  }}
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1 mb-2">{recipe.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                  {recipe.description || 'No description provided.'}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{recipe.difficulty || 'Medium'}</span>
                  <span>{(recipe.likes?.length || 0)} likes</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ChefDetailsPage;
