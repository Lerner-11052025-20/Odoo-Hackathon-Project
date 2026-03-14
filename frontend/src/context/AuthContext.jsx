import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('ci_token') || null);
  const [isLoading, setIsLoading] = useState(true);

  // Set axios default auth header
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Fetch current user on app load
  const loadUser = useCallback(async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      const { data } = await api.get('/auth/me');
      if (data.success) setUser(data.user);
    } catch {
      localStorage.removeItem('ci_token');
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => { loadUser(); }, [loadUser]);

  const login = async (loginId, password) => {
    const { data } = await api.post('/auth/login', { loginId, password });
    if (data.success) {
      localStorage.setItem('ci_token', data.token);
      setToken(data.token);
      setUser(data.user);
      toast.success(`Welcome back, ${data.user.loginId}! 🎉`);
      return data.user;
    }
  };

  const register = async (formData) => {
    const { data } = await api.post('/auth/register', formData);
    if (data.success) {
      localStorage.setItem('ci_token', data.token);
      setToken(data.token);
      setUser(data.user);
      toast.success('Account created successfully! 🚀');
      return data.user;
    }
  };

  const logout = () => {
    localStorage.removeItem('ci_token');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully.');
  };

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{ user, token, isLoading, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
