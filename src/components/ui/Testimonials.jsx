import React, { useState } from 'react';

function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Chef Maria Rodriguez",
      role: "Professional Pastry Chef",
      image: "https://randomuser.me/api/portraits/women/1.jpg",
      content: "RecipeNest has transformed how I share my recipes. The platform is intuitive, and I've connected with food lovers from around the world. My following has grown exponentially!",
      rating: 5
    },
    {
      id: 2,
      name: "Chef David Chen",
      role: "Executive Chef",
      image: "https://randomuser.me/api/portraits/men/2.jpg",
      content: "Finally, a platform built specifically for chefs! The recipe management tools are exactly what I needed. It's like having a professional portfolio that's always up to date.",
      rating: 5
    },
    {
      id: 3,
      name: "Chef Sarah Johnson",
      role: "Culinary Instructor",
      image: "https://randomuser.me/api/portraits/women/3.jpg",
      content: "I've tried many platforms, but RecipeNest stands out. The community is amazing, and the dark mode is a lifesaver for late-night recipe planning!",
      rating: 5
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="py-16 bg-linear-to-br from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">What Chefs Say</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Join thousands of satisfied chefs using RecipeNest</p>
        </div>
        
        <div className="relative max-w-4xl mx-auto">
          {/* Testimonial Card */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 md:p-12">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <img
                  src={testimonials[currentIndex].image}
                  alt={testimonials[currentIndex].name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-orange-500 mb-4"
                />
                <div className="absolute -top-2 -right-2 bg-orange-500 rounded-full p-2">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-500 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-lg text-gray-700 dark:text-gray-300 italic mb-6">
                "{testimonials[currentIndex].content}"
              </p>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                  {testimonials[currentIndex].name}
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {testimonials[currentIndex].role}
                </p>
              </div>
            </div>
          </div>
          
          {/* Navigation Buttons */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -ml-4 md:-ml-12 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
          >
            <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 -mr-4 md:-mr-12 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
          >
            <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentIndex === index
                    ? 'w-8 bg-orange-600'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Testimonials;