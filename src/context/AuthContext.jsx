import React, { createContext, useState, useEffect, useMemo } from 'react';
import apiClient from '../api/apiClient';
import toast from 'react-hot-toast';

export const AuthContext = createContext({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateUser: () => {}
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('recipenest_token');
      const storedUser = localStorage.getItem('recipenest_user');
      
      if (token && storedUser) {
        try {
          // Set token in axios headers
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Verify token is still valid by fetching current user
          const response = await apiClient.get('/auth/me');
          setUser(response.data.user);
          // Update stored user with latest data
          localStorage.setItem('recipenest_user', JSON.stringify(response.data.user));
        } catch (error) {
          // Token is invalid or expired
          console.error('Session validation failed:', error);
          localStorage.removeItem('recipenest_token');
          localStorage.removeItem('recipenest_user');
          delete apiClient.defaults.headers.common['Authorization'];
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('recipenest_user', JSON.stringify(user));
    }
  }, [user]);

  const login = async (credentials) => {
    try {
      const res = await apiClient.post('/auth/login', credentials);
      const { token, user: returned } = res.data;
      
      // Store token and user
      localStorage.setItem('recipenest_token', token);
      localStorage.setItem('recipenest_user', JSON.stringify(returned));
      
      // Set token in axios headers for future requests
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(returned);
      toast.success('Welcome back!');
      return { success: true, user: returned };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      throw error;
    }
  };

  const register = async (payload) => {
    try {
      const res = await apiClient.post('/auth/register', payload);
      const { token, user: returned } = res.data;
      
      // Store token and user
      localStorage.setItem('recipenest_token', token);
      localStorage.setItem('recipenest_user', JSON.stringify(returned));
      
      // Set token in axios headers for future requests
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(returned);
      toast.success('Account created successfully!');
      return { success: true, user: returned };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('recipenest_token');
    localStorage.removeItem('recipenest_user');
    delete apiClient.defaults.headers.common['Authorization'];
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('recipenest_user', JSON.stringify(updatedUser));
  };

  const memoed = useMemo(() => ({ 
    user, 
    loading, 
    login, 
    register, 
    logout, 
    updateUser 
  }), [user, loading]);

  return (
    <AuthContext.Provider value={memoed}>
      {children}
    </AuthContext.Provider>
  );
};