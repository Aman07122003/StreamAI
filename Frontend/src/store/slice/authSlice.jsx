import React from 'react'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api';
import axios from 'axios';

// Load from localStorage safely
let storedUser = localStorage.getItem('user');
try {
  storedUser = storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;
} catch (err) {
  storedUser = null;
}

const initialState = {
  user: storedUser,
  isAuthenticated: !!localStorage.getItem('accessToken') || false,
  accessToken: localStorage.getItem('accessToken') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  loading: false,
  error: null,
  status: false, 
}                                                      

// Register
export const register = createAsyncThunk(
  '/users/register',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post('/users/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Unknown error' });
    }
  }
);

// Login
export const login = createAsyncThunk('/users/login', async (userData, { rejectWithValue }) => {
  try {
    const response = await api.post('/users/login', userData);
    console.log(response.data.data);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Logout
export const logout = createAsyncThunk(
    '/users/logout',
    async (_, { rejectWithValue }) => {
      try {
        await api.post('/users/logout');
        return true;
      } catch (error) {
        // clear local session anyway
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        
        return rejectWithValue(
          error.response?.data || { message: 'Logout failed on server, but local session cleared' }
        );
      }
    }
  );
  
  
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder 
      // REGISTER
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        const { user, accessToken, refreshToken } = action.payload.data;
        state.loading = false;
        state.user = user;
        state.isAuthenticated = true;
        state.accessToken = accessToken;
        state.refreshToken = refreshToken;

        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || 'Registration failed';
      })

      // LOGIN
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        const { user, accessToken, refreshToken } = action.payload.data;
        state.loading = false;
        state.user = user;
        state.isAuthenticated = true;
        state.accessToken = accessToken;
        state.refreshToken = refreshToken;

        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        console.log("✅ User logged in");
        console.log("User:", JSON.parse(localStorage.getItem('user')));
        console.log("AccessToken:", localStorage.getItem('accessToken'));
        console.log("RefreshToken:", localStorage.getItem('refreshToken'));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || 'Login failed';
      })

      // LOGOUT
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.status = false;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.accessToken = null;
        state.refreshToken = null;

        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Logout failed';
      })      
  }
}); 

export default authSlice.reducer;
