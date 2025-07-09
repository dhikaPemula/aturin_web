// authService.js - Real Implementation
import axios from 'axios';
import API_CONFIG from './config/api.js';

const api = axios.create(API_CONFIG);

// Interceptor untuk token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/login', credentials);
    
    // Simpan token ke localStorage
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/register', {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      password_confirmation: userData.confirmPassword,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};


export const sendPasswordResetEmail = async (email) => {
  try {
    const response = await api.post('/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to send reset email');
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const response = await api.post('/reset-password', {
      token,
      password: newPassword
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Password reset failed');
  }
};

export const logoutUser = async () => {
  try {
    const response = await api.post('/logout');
    // Hapus token dari localStorage setelah logout
    localStorage.removeItem('auth_token');
    localStorage.removeItem('token'); // Untuk kompatibilitas jika ada
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Logout failed');
  }
};