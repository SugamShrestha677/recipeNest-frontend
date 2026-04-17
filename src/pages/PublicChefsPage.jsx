import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function PublicChefsPage() {
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');

  // Dummy chefs data for public view
  const dummyChefs = [
    {
      _id: 'chef1',
      name: 'Chef Maria Rodriguez',
      specialty: 'Italian Cuisine',
      experience: 12,
      location: 'Rome, Italy',
      image: 'https://randomuser.me/api/portraits/women/1.jpg',
      recipeCount: 24,
      followers: 3456,
      bio: 'Passionate about authentic Italian cooking and sharing traditional recipes passed down through generations.',
      awards: ['Best Italian Chef 2022', 'Michelin Star 2023']
    },
    {
      _id: 'chef2',
      name: 'Chef David Chen',
      specialty: 'Asian Fusion',
      experience: 8,
      location: 'Singapore',
      image: 'https://randomuser.me/api/portraits/men/2.jpg',
      recipeCount: 18,
      followers: 2345,
      bio: 'Creating innovative Asian fusion dishes with a modern twist.',
      awards: ['Young Chef Award 2021']
    },
    {
      _id: 'chef3',
      name: 'Chef Sarah Johnson',
      specialty: 'Pastry Arts',
      experience: 10,
      location: 'Paris, France',
      image: 'https://randomuser.me/api/portraits/women/3.jpg',
      recipeCount: 32,
      followers: 5678,
      bio: 'Award-winning pastry chef specializing in French patisserie.',
      awards: ['Pastry Chef of the Year 2023', 'Gold Medal World Pastry Cup']
    },
    {
      _id: 'chef4',
      name: 'Chef Hiroshi Tanaka',
      specialty: 'Japanese Cuisine',
      experience: 15,
      location: 'Tokyo, Japan',
      image: 'https://randomuser.me/api/portraits/men/4.jpg',
      recipeCount: 42,
      followers: 7890,
      bio: 'Master sushi chef with 15 years of experience in traditional Japanese cuisine.',
      awards: ['Sushi Master 2020', 'Best Japanese Restaurant 2022']
    },
    {
      _id: 'chef5',
      name: 'Chef Elena Garcia',
      specialty: 'Mediterranean',
      experience: 7,
      location: 'Barcelona, Spain',
      image: 'https://randomuser.me/api/portraits/women/5.jpg',
      recipeCount: 15,
      followers: 1876,
      bio: 'Bringing the flavors of the Mediterranean to your kitchen.',
      awards: ['Rising Star Chef 2023']
    },
    {
      _id: 'chef6',
      name: 'Chef James Wilson',
      specialty: 'British Cuisine',
      experience: 20,
      location: 'London, UK',
      image: 'https://randomuser.me/api/portraits/men/6.jpg',
      recipeCount: 56,
      followers: 12345,
      bio: 'Celebrity chef specializing in modern British cuisine.',
      awards: ['GB Chef of the Year', '3 Michelin Stars']
    }
  ];

  const specialties = ['all', ...new Set(dummyChefs.map(chef => chef.specialty))];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setChefs(dummyChefs);
      setLoading(false);
    }, 800);
  }, []);

  const filteredChefs = chefs.filter(chef => {
    const matchesSearch = chef.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chef.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chef.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chef.bio.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'all' || chef.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

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
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Meet Our Talented Chefs
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover culinary artists from around the world and their amazing recipes
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search Chefs
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name, specialty, location, or bio..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
                <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Filter by Specialty
              </label>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
              >
                {specialties.map(specialty => (
                  <option key={specialty} value={specialty}>
                    {specialty === 'all' ? 'All Specialties' : specialty}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-gray-600 dark:text-gray-400">
          Found {filteredChefs.length} {filteredChefs.length === 1 ? 'chef' : 'chefs'}
        </div>

        {/* Chefs Grid */}
        {filteredChefs.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No chefs found</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Try adjusting your search or filters
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedSpecialty('all');
              }}
              className="mt-4 text-orange-600 hover:text-orange-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChefs.map((chef) => (
              <Link
                key={chef._id}
                to={`/chefs/${chef._id}`}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group"
              >
                <div className="p-6 text-center">
                  {/* Chef Image */}
                  <div className="relative inline-block">
                    <img
                      src={chef.image}
                      alt={chef.name}
                      className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-orange-500 group-hover:border-orange-600 transition-all"
                    />
                    <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full px-2 py-1">
                      {chef.followers.toLocaleString()} followers
                    </div>
                  </div>
                  
                  {/* Chef Info */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-orange-600 transition-colors">
                    {chef.name}
                  </h3>
                  <p className="text-orange-600 dark:text-orange-400 text-sm font-medium mb-2">
                    {chef.specialty}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    📍 {chef.location}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {chef.bio}
                  </p>
                  
                  {/* Stats */}
                  <div className="flex justify-center gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">{chef.recipeCount}</div>
                      <div className="text-xs text-gray-500">Recipes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">{chef.experience}+</div>
                      <div className="text-xs text-gray-500">Years</div>
                    </div>
                  </div>
                  
                  {/* Awards Preview */}
                  {chef.awards && chef.awards.length > 0 && (
                    <div className="flex flex-wrap gap-1 justify-center">
                      {chef.awards.slice(0, 2).map((award, index) => (
                        <span key={index} className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                          🏆 {award}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* View Profile Button */}
                  <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-orange-600 group-hover:text-orange-700 text-sm font-medium flex items-center justify-center gap-1">
                      View Profile
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Call to Action for Unauthenticated Users */}
        <div className="mt-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Want to Become a Featured Chef?</h2>
          <p className="mb-4">Join our community of culinary professionals and showcase your talent!</p>
          <Link
            to="/register"
            className="inline-block bg-white text-orange-600 px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Become a Chef
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PublicChefsPage;