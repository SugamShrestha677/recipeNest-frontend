import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

function HeroSection() {
  const containerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 30, stiffness: 200 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);
  
  const rotateX = useTransform(y, [-300, 300], [10, -10]);
  const rotateY = useTransform(x, [-300, 300], [-10, 10]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        mouseX.set(e.clientX - centerX);
        mouseY.set(e.clientY - centerY);
        
        // Track mouse position for light effect
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const stats = [
    { value: "10K+", label: "Active Chefs", delay: 0, icon: "👨‍🍳" },
    { value: "50K+", label: "Recipes Shared", delay: 0.1, icon: "📖" },
    { value: "1M+", label: "Food Lovers", delay: 0.2, icon: "❤️" }
  ];

  return (
    <div 
      ref={containerRef} 
      className="relative bg-linear-to-br from-orange-50 via-red-50 to-amber-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 overflow-hidden min-h-screen flex items-center"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Dynamic Cursor Light Effect - Enhanced for Dark Mode */}
      <motion.div
        className="fixed pointer-events-none z-20"
        animate={{
          x: mousePosition.x - 200,
          y: mousePosition.y - 200,
          opacity: isHovering ? 1 : 0
        }}
        transition={{ type: "spring", damping: 20, stiffness: 150 }}
        style={{
          position: 'fixed',  // ← MAKE SURE THIS IS 'fixed'
          left: 0,            // ← ADD THIS
          top: 0,             // ← ADD THIS
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.4) 30%, rgba(255, 255, 255, 0.05) 60%',
          filter: 'blur(30px)',
        }}
      />
      
      {/* Additional Glow Effect for Dark Mode */}
      
      
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-30"
          animate={{
            x: [0, -80, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-20"
          animate={{
            x: [0, 50, -50, 0],
            y: [0, -30, 30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Subtle gradient overlay that follows cursor */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-10"
        animate={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, 
            rgba(249,115,22,0.08) 0%, 
            rgba(249,115,22,0.03) 50%, 
            transparent 80%)`
        }}
        transition={{ duration: 0.1 }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 w-full z-20">
        <motion.div
          style={{ rotateX, rotateY }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="mb-8 cursor-pointer"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <span className="inline-block text-7xl md:text-8xl floating-emoji drop-shadow-2xl">🍽️✨</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
          >
            Share Your
            <span className="bg-linear-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent relative inline-block ml-2">
              Culinary Masterpieces
              <motion.svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 10"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 1 }}
              >
                <path
                  d="M0,5 Q20,0 40,5 T80,5 T120,5 T160,5 T200,5"
                  stroke="#f97316"
                  fill="none"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                />
              </motion.svg>
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-gray-700 dark:text-gray-300 mb-10 max-w-3xl mx-auto backdrop-blur-sm bg-white/30 dark:bg-black/30 p-4 rounded-2xl shadow-lg"
          >
            Join the world's largest community of professional chefs and food enthusiasts. 
            Showcase your recipes, build your brand, and connect with food lovers globally.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-5 justify-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/register"
                className="group relative bg-linear-to-r from-orange-600 to-red-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 overflow-hidden block"
              >
                <span className="relative z-10">Start Your Journey</span>
                <div className="absolute inset-0 bg-white/20 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                <motion.div
                  className="absolute inset-0 bg-linear-to-r from-orange-400 to-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ filter: 'blur(10px)' }}
                />
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/recipes"
                className="bg-white dark:bg-gray-800 text-orange-600 dark:text-orange-400 px-8 py-4 rounded-full font-bold text-lg border-2 border-orange-600 dark:border-orange-400 hover:bg-orange-50 dark:hover:bg-gray-700 transition-all duration-300 backdrop-blur-sm inline-block hover:shadow-xl"
              >
                Browse Recipes
              </Link>
            </motion.div>
          </motion.div>
          
          {/* Stats with enhanced hover effects */}
          <div className="grid grid-cols-3 gap-6 mt-20 max-w-3xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + stat.delay }}
                whileHover={{ 
                  scale: 1.1, 
                  y: -8,
                  transition: { type: "spring", stiffness: 400 }
                }}
                className="group cursor-default p-4 rounded-2xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm transition-all duration-300 hover:bg-white/70 dark:hover:bg-gray-700/70 hover:shadow-xl relative overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-linear-to-r from-orange-400/20 to-red-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                <div className="relative z-10">
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 1 + stat.delay }}
                    className="text-4xl md:text-5xl font-black text-orange-600 dark:text-orange-400"
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-gray-700 dark:text-gray-300 font-medium mt-1">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Floating particles that react to cursor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-orange-500/30 dark:bg-orange-400/40 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: mousePosition.x + (Math.random() - 0.5) * 100,
              y: mousePosition.y + (Math.random() - 0.5) * 100,
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            style={{
              filter: 'blur(1px)',
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          50% { 
            transform: translateY(-20px) rotate(5deg); 
          }
        }
        .floating-emoji {
          animation: float 3s ease-in-out infinite;
          display: inline-block;
          filter: drop-shadow(0 10px 8px rgb(0 0 0 / 0.04));
        }
        
        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }
      `}</style>
    </div>
  );
}

export default HeroSection;