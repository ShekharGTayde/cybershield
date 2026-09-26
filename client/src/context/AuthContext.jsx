import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_USERS } from '../services/mockData';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('cybershield_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('cybershield_token') || null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    if (user) {
      localStorage.setItem('cybershield_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('cybershield_user');
    }
  }, [user]);

  // Verify active JWT token on boot
  useEffect(() => {
    async function verifySession() {
      const activeToken = localStorage.getItem('cybershield_token');
      if (activeToken && !activeToken.startsWith('mock-jwt-token')) {
        try {
          const res = await api.auth.getMe();
          if (res?.success && res.data) {
            setUser(res.data);
          }
        } catch (e) {
          console.warn('Session verification failed, logging out:', e.message);
          logout();
        }
      }
      setIsLoadingAuth(false);
    }
    verifySession();
  }, []);

  const login = async (credentials) => {
    const res = await api.auth.login(credentials);
    if (res.success && res.data) {
      setUser(res.data.user);
      setToken(res.data.token);
      localStorage.setItem('cybershield_token', res.data.token);
      localStorage.setItem('cybershield_user', JSON.stringify(res.data.user));
      return res.data.user;
    }
    throw new Error(res.error?.message || 'Login failed');
  };

  const register = async (userData) => {
    const res = await api.auth.register(userData);
    if (res.success && res.data) {
      setUser(res.data.user);
      setToken(res.data.token);
      localStorage.setItem('cybershield_token', res.data.token);
      localStorage.setItem('cybershield_user', JSON.stringify(res.data.user));
      return res.data.user;
    }
    throw new Error(res.error?.message || 'Registration failed');
  };

  const logout = () => {
    api.auth.logout();
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
    const mockToken = 'mock-jwt-token-' + target._id;
    setToken(mockToken);
    localStorage.setItem('cybershield_token', mockToken);
    localStorage.setItem('cybershield_user', JSON.stringify(target));
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, switchDemoRole, isAuthenticated: !!user, isLoadingAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
