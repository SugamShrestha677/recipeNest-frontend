import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

function HowItWorks() {
  const steps = [
    {
      icon: "📝",
      title: "Create Your Profile",
      description: "Sign up and create your professional chef profile with your specialties, experience, and portfolio.",
      color: "from-orange-500 to-orange-600",
      gradient: "from-orange-400 to-red-500"
    },
    {
      icon: "🍳",
      title: "Share Your Recipes",
      description: "Add your signature dishes with ingredients, instructions, and beautiful photos.",
      color: "from-red-500 to-red-600",
      gradient: "from-red-400 to-pink-500"
    },
    {
      icon: "👥",
      title: "Build Your Audience",
      description: "Connect with food lovers and fellow chefs, get feedback, and grow your following.",
      color: "from-purple-500 to-purple-600",
      gradient: "from-purple-400 to-indigo-500"
    }
  ];

  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const stepVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.6, type: "spring" }
    })
  };

  return (
    <div className="py-20 bg-white dark:bg-gray-950 relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div ref={containerRef} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">How It Works</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-3 text-lg">Three simple steps to start your culinary journey 🚀</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={stepVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              whileHover={{ y: -10, scale: 1.02 }}
              className="relative group cursor-pointer"
            >
              <div className="relative p-8 rounded-3xl bg-linear-to-br from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-900 shadow-xl transition-all duration-500 hover:shadow-2xl">
                {/* Animated icon container */}
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className={`w-24 h-24 mx-auto bg-linear-to-r ${step.gradient} rounded-2xl flex items-center justify-center text-5xl mb-6 shadow-lg`}
                >
                  {step.icon}
                </motion.div>
                
                <h3 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                  {step.description}
                </p>
                
                {/* Step number indicator */}
                <div className="absolute -top-3 -right-3 w-12 h-12 bg-linear-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {index + 1}
                </div>
                
                {/* Animated border on hover */}
                <motion.div
                  className="absolute inset-0 rounded-3xl pointer-events-none"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    background: `linear-gradient(135deg, ${step.color.split(' ')[0].replace('from-', '')}, transparent)`,
                    borderRadius: '1.5rem',
                    padding: '2px'
                  }}
                />
              </div>
              
              {/* Connector line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 left-full w-full h-0.5">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={isInView ? { scaleX: 1 } : {}}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="h-full bg-linear-to-r from-orange-400 to-red-400 origin-left"
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HowItWorks;