import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Layout({ children }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        {/* Header */}
        <header className="bg-white dark:bg-black py-1 shadow-lg sticky top-0 z-50 transition-colors duration-300">
          <div className="w-full px-15 ">
            <div className="flex justify-between items-center h-20">
              {/* Logo */}
              <div className="flex items-center">
                <Link
                  to="/"
                  className="flex items-center space-x-2 group"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-3xl transform transition-transform group-hover:scale-110">
                    🍽️
                  </span>
                  <span className="font-bold text-3xl bg-linear-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    RecipeNest
                  </span>
                </Link>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-6 text-xl">
                <Link
                  to="/"
                  className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                >
                  Home
                </Link>
                <Link
                  to="/recipes"
                  className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                >
                  Recipes
                </Link>
                <Link
                  to="/chefs"
                  className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                >
                  Chefs
                </Link>

                {/* Dark Mode Toggle */}
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? (
                    <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                </button>

                {user ? (
                  <div className="relative group">
                    <button className="flex items-center space-x-2 focus:outline-none">
                      <img
                        src={user.profilePicture || 'https://ui-avatars.com/api/?background=ea580c&color=fff&bold=true&name=' + (user.fullName || user.name || 'User')}
                        alt={user.fullName || user.name}
                        className="w-8 h-8 rounded-full object-cover border-2 border-orange-500"
                        onError={(e) => {
                          e.target.src = 'https://ui-avatars.com/api/?background=ea580c&color=fff&bold=true&name=User';
                        }}
                      />
                      <span className="text-gray-700 dark:text-gray-300 font-medium">
                        {user.fullName?.split(' ')[0] || user.name?.split(' ')[0] || 'User'}
                      </span>
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="py-2">
                        <Link
                          to="/dashboard"
                          className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          Dashboard
                        </Link>
                        <Link
                          to="/my-recipes"
                          className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          My Recipes
                        </Link>
                        <Link
                          to="/profile/edit"
                          className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          Edit Profile
                        </Link>
                        <hr className="my-2 border-gray-200 dark:border-gray-700" />
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Link
                      to="/login"
                      className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="bg-linear-to-r from-orange-600 to-red-600 text-white px-5 py-2 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden flex items-center space-x-3">
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? (
                    <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 focus:outline-none"
                  aria-label="Toggle menu"
                >
                  {isMenuOpen ? (
                    <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
              <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700 animate-fadeIn">
                <div className="space-y-3">
                  <Link
                    to="/"
                    className="block py-2 text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    to="/recipes"
                    className="block py-2 text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Recipes
                  </Link>
                  <Link
                    to="/chefs"
                    className="block py-2 text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Chefs
                  </Link>
                  
                  {user ? (
                    <>
                      <Link
                        to="/dashboard"
                        className="block py-2 text-gray-700 dark:text-gray-300 hover:text-orange-600"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/my-recipes"
                        className="block py-2 text-gray-700 dark:text-gray-300 hover:text-orange-600"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        My Recipes
                      </Link>
                      <Link
                        to="/profile/edit"
                        className="block py-2 text-gray-700 dark:text-gray-300 hover:text-orange-600"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Edit Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left py-2 text-red-600 font-medium"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <div className="space-y-3 pt-2">
                      <Link
                        to="/login"
                        className="block py-2 text-gray-700 dark:text-gray-300 hover:text-orange-600"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        className="block py-2 bg-linear-to-r from-orange-600 to-red-600 text-white text-center rounded-lg font-semibold"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">RecipeNest</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  A platform for culinary professionals to share their expertise and connect with food lovers.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">Quick Links</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li><Link to="/recipes" className="hover:text-orange-600">Recipes</Link></li>
                  <li><Link to="/chefs" className="hover:text-orange-600">Chefs</Link></li>
                  {!user && <li><Link to="/register" className="hover:text-orange-600">Become a Chef</Link></li>}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">Legal</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li><a href="#" className="hover:text-orange-600">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-orange-600">Terms of Service</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">Connect</h4>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-orange-600">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-orange-600">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.104c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0021.957-12.57c.945-.73 1.764-1.64 2.417-2.676z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-orange-600">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center text-sm text-gray-500 dark:text-gray-400">
              <p>© 2024 RecipeNest. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Layout;