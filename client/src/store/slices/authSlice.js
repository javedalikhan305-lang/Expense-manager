import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    isAuthenticated: !!localStorage.getItem('token'),
    isAdmin: JSON.parse(localStorage.getItem('user'))?.isAdmin || false,
    loading: false,
  },
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.isAdmin = action.payload.isAdmin || false;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isAdmin = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
});

export const { loginStart, loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
