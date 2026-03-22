import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <div className="relative bg-linear-to-br from-orange-50 to-red-50 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-4.0.3"
          alt="Cooking background"
          className="w-full h-full object-cover opacity-10"
        />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            Share Your
            <span className="text-orange-600"> Culinary Masterpieces</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join the world's largest community of professional chefs and food enthusiasts. 
            Showcase your recipes, build your brand, and connect with food lovers globally.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Start Your Journey
            </Link>
            <Link
              to="/recipes"
              className="bg-white text-orange-600 px-8 py-4 rounded-lg font-semibold text-lg border-2 border-orange-600 hover:bg-orange-50 transition-all duration-300"
            >
              Browse Recipes
            </Link>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-orange-600">10K+</div>
              <div className="text-gray-600">Active Chefs</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600">50K+</div>
              <div className="text-gray-600">Recipes Shared</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600">1M+</div>
              <div className="text-gray-600">Food Lovers</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}