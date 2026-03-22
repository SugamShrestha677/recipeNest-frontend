import React from 'react';

function HowItWorks() {
  const steps = [
    {
      icon: "📝",
      title: "Create Your Profile",
      description: "Sign up and create your professional chef profile with your specialties, experience, and portfolio.",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: "🍳",
      title: "Share Your Recipes",
      description: "Add your signature dishes with ingredients, instructions, and beautiful photos.",
      color: "from-red-500 to-red-600"
    },
    {
      icon: "👥",
      title: "Build Your Audience",
      description: "Connect with food lovers and fellow chefs, get feedback, and grow your following.",
      color: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <div className="py-16 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">How It Works</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Three simple steps to start your culinary journey</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center group">
              <div className="relative">
                <div className={`w-24 h-24 mx-auto bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center text-4xl mb-6 transform group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  {step.icon}
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-2/3 w-full">
                    <div className="border-t-2 border-dashed border-gray-300 dark:border-gray-700"></div>
                  </div>
                )}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HowItWorks;