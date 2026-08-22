import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_USERS } from '../services/mockData';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('cybershield_user');
    return saved ? JSON.parse(saved) : MOCK_USERS[0]; // Default to Major Vikram Rathore
  });
  const [token, setToken] = useState(() => localStorage.getItem('cybershield_token') || 'mock-jwt-token');

  useEffect(() => {
    if (user) {
      localStorage.setItem('cybershield_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('cybershield_user');
    }
  }, [user]);

  const login = async (credentials) => {
    const res = await api.auth.login(credentials);
    if (res.success) {
      setUser(res.data.user);
      setToken(res.data.token);
      localStorage.setItem('cybershield_token', res.data.token);
      return res.data.user;
    }
    throw new Error(res.error?.message || 'Login failed');
  };

  const register = async (userData) => {
    const res = await api.auth.register(userData);
    if (res.success) {
      setUser(res.data.user);
      setToken(res.data.token);
      localStorage.setItem('cybershield_token', res.data.token);
      return res.data.user;
    }
    throw new Error(res.error?.message || 'Registration failed');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('cybershield_user');
    localStorage.removeItem('cybershield_token');
  };

  // Quick Demo Role Switcher to seamlessly test all perspectives
  const switchDemoRole = (roleKey) => {
    let target = MOCK_USERS[0];
    if (roleKey === 'INVESTIGATOR') target = MOCK_USERS[1];
    if (roleKey === 'ADMIN') target = MOCK_USERS[2];
    if (roleKey === 'FAMILY') target = MOCK_USERS[3];
    setUser(target);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, switchDemoRole, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
