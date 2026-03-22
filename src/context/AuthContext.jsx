import React, { createContext, useState, useEffect, useMemo } from 'react';
import apiClient from '../api/apiClient';

export const AuthContext = createContext({
  user: null,
  login: async () => {},
  register: async () => {},
  logout: () => {}
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('recipenest_user');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('recipenest_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('recipenest_user');
    }
  }, [user]);

  const login = async (credentials) => {
    const res = await apiClient.post('/auth/login', credentials);
    const { token, user: returned } = res.data;
    localStorage.setItem('recipenest_token', token);
    setUser(returned);
  };

  const register = async (payload) => {
    const res = await apiClient.post('/auth/register', payload);
    const { token, user: returned } = res.data;
    localStorage.setItem('recipenest_token', token);
    setUser(returned);
  };

  const logout = () => {
    localStorage.removeItem('recipenest_token');
    setUser(null);
  };

  const memoed = useMemo(() => ({ user, login, register, logout }), [user]);

  return <AuthContext.Provider value={memoed}>{children}</AuthContext.Provider>;
};
