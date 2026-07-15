import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// 🔥 API Base URL – uses environment variable or falls back to local
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('authToken') || null);

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      const { token, user } = response.data;
      localStorage.setItem('authToken', token);
      setToken(token);
      setUser(user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Login failed' };
    }
  };

  const signup = async (name, email, password, phone) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, { name, email, password, phone });
      const { token, user } = response.data;
      localStorage.setItem('authToken', token);
      setToken(token);
      setUser(user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Signup failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (data) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/auth/profile`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Update failed' };
    }
  };

  const updateProfilePicture = async (imageUrl) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/profile-picture`, { imageUrl }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser({ ...user, profilePicture: response.data.profilePicture });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Update failed' };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      token,
      login,
      signup,
      logout,
      updateProfile,
      updateProfilePicture,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};