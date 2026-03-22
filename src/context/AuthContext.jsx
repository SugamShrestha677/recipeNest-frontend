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
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('recipenest_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('recipenest_token');
      if (token && user) {
        try {
          // Set token in apiClient
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          // Verify token is still valid
          const response = await apiClient.get('/auth/me');
          setUser(response.data.user);
        } catch (error) {
          // Token is invalid, clear everything
          localStorage.removeItem('recipenest_token');
          localStorage.removeItem('recipenest_user');
          delete apiClient.defaults.headers.common['Authorization'];
          setUser(null);
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, []);

  // Persist user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('recipenest_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('recipenest_user');
    }
  }, [user]);

  const login = async (credentials) => {
    try {
      const res = await apiClient.post('/auth/login', credentials);
      const { token, user: returned } = res.data;
      localStorage.setItem('recipenest_token', token);
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
      localStorage.setItem('recipenest_token', token);
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

  return <AuthContext.Provider value={memoed}>{children}</AuthContext.Provider>;
};