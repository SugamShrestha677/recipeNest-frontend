import React from 'react';
import { Link } from 'react-router-dom';

function HeroSection() {
  return (
    <div className="relative bg-linear-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-4.0.3')] bg-cover bg-center opacity-5"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="text-center">
          <div className="mb-6 animate-bounce">
            <span className="inline-block text-6xl">🍽️</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
            Share Your
            <span className="bg-linear-to-r from-orange-600 to-red-600 bg-clip-text text-transparent"> Culinary Masterpieces</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Join the world's largest community of professional chefs and food enthusiasts. 
            Showcase your recipes, build your brand, and connect with food lovers globally.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-linear-to-r from-orange-600 to-red-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Start Your Journey
            </Link>
            <Link
              to="/recipes"
              className="bg-white dark:bg-gray-800 text-orange-600 dark:text-orange-400 px-8 py-4 rounded-lg font-semibold text-lg border-2 border-orange-600 dark:border-orange-400 hover:bg-orange-50 dark:hover:bg-gray-700 transition-all duration-300"
            >
              Browse Recipes
            </Link>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-orange-600 dark:text-orange-400">10K+</div>
              <div className="text-gray-600 dark:text-gray-400 mt-1">Active Chefs</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-orange-600 dark:text-orange-400">50K+</div>
              <div className="text-gray-600 dark:text-gray-400 mt-1">Recipes Shared</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-orange-600 dark:text-orange-400">1M+</div>
              <div className="text-gray-600 dark:text-gray-400 mt-1">Food Lovers</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;