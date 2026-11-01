import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('shopsphere_token'));
  const [loading, setLoading] = useState(true);
  const { success, error: toastError } = useToast();

  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await authApi.getCurrentUser();
        if (response?.data) {
          setUser(response.data);
        }
      } catch (err) {
        console.error('Failed to load current user', err);
        logout(false);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await authApi.login({ email, password });
      const { token: jwtToken, user: userData } = response.data;
      localStorage.setItem('shopsphere_token', jwtToken);
      setToken(jwtToken);
      setUser(userData);
      success(`Welcome back, ${userData.firstName}!`);
      return userData;
    } catch (err) {
      toastError(err.message || 'Login failed. Please check your credentials.');
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authApi.register(userData);
      const { token: jwtToken, user: newUser } = response.data;
      localStorage.setItem('shopsphere_token', jwtToken);
      setToken(jwtToken);
      setUser(newUser);
      success(`Account created! Welcome to ShopSphere, ${newUser.firstName}!`);
      return newUser;
    } catch (err) {
      toastError(err.message || 'Registration failed.');
      throw err;
    }
  };

  const logout = (showToast = true) => {
    localStorage.removeItem('shopsphere_token');
    setToken(null);
    setUser(null);
    if (showToast) {
      success('Logged out successfully.');
    }
  };

  const isAdmin = user?.role === 'ROLE_ADMIN';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
