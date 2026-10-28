import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('roomora_token'));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('roomora_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('roomora_token');
    localStorage.removeItem('roomora_user');
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    const handleAuthExpired = () => {
      logout();
    };

    window.addEventListener('roomora_auth_expired', handleAuthExpired);
    return () => {
      window.removeEventListener('roomora_auth_expired', handleAuthExpired);
    };
  }, [logout]);

  useEffect(() => {
    let isMounted = true;

    async function syncProfile() {
      if (!token) {
        if (isMounted) setIsLoading(false);
        return;
      }

      try {
        const profile = await authService.getProfile();
        if (isMounted) {
          setUser(profile);
          localStorage.setItem('roomora_user', JSON.stringify(profile));
        }
      } catch (err) {
        if (isMounted && err.response?.status === 401) {
          logout();
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    syncProfile();

    return () => {
      isMounted = false;
    };
  }, [token, logout]);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    localStorage.setItem('roomora_token', data.access_token);
    localStorage.setItem('roomora_user', JSON.stringify(data.user));
    setToken(data.access_token);
    setUser(data.user);
    return data;
  };

  const register = async (userData) => {
    return await authService.register(userData);
  };

  const updateUser = (updatedProfile) => {
    setUser((prev) => {
      const merged = { ...prev, ...updatedProfile };
      localStorage.setItem('roomora_user', JSON.stringify(merged));
      return merged;
    });
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    isStudent: user?.role === 'student',
    isOwner: user?.role === 'owner',
    role: user?.role,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
