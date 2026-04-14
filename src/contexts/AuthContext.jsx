import React, { createContext, useContext, useState, useEffect } from 'react';
import { SESSION_TIMEOUT } from '../utils/constants';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionTimer, setSessionTimer] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setIsAuthenticated(true);
      startSessionTimer();
    }
  }, []);

  const startSessionTimer = () => {
    // Clear existing timer
    if (sessionTimer) {
      clearTimeout(sessionTimer);
    }

    // Set new timer
    const timer = setTimeout(() => {
      logout();
    }, SESSION_TIMEOUT);

    setSessionTimer(timer);
  };

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
    startSessionTimer();
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    if (sessionTimer) {
      clearTimeout(sessionTimer);
    }
  };

  const resetSessionTimer = () => {
    if (isAuthenticated) {
      startSessionTimer();
    }
  };

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    resetSessionTimer,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
