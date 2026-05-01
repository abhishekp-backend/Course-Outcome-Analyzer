import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from "../reqURL"

// JWT utility functions
const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch (error) {
    return true;
  }
};

const getTokenFromStorage = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  if (isTokenExpired(token)) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return null;
  }
  
  return token;
};

const setAuthData = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

const clearAuthData = () => {
  document.cookie = ""
};

// HTTP client with automatic JWT token handling
const createAuthenticatedRequest = async (url, options = {}) => {
  const token = getTokenFromStorage();
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const response = await fetch(url, config);
  
  // If token is expired, clear auth data
  if (response.status === 401) {
    clearAuthData();
  }
  const json = await response.json()
  
  return {response, json};
};

// Async thunks for API calls
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await api.post('/api/auth/login', {
        ...credentials,
        role: "FACULTY"
      });

      return res.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async () => {
    clearAuthData();
    return null;
  }
);

export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async (_, { rejectWithValue, getState }) => {
    try {
      // Verify JWT token with backend
      const state = getState();
      if (state.auth.isAuthenticated) {
        return true;
      }
      const {response, json} = await createAuthenticatedRequest('/api/auth/profile');

      if (!response.ok) {
        return rejectWithValue('Invalid token');
      }
      return json.user;
    } catch {
      clearAuthData();
      return rejectWithValue('Authentication check failed');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const token = getTokenFromStorage();
      
      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const response = await createAuthenticatedRequest('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Profile update failed');
      }

      // Update user data in localStorage
      localStorage.setItem('user', JSON.stringify(data.user));

      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: false,
  isAuthenticating: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Logout
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      });

    // Check Auth Status
    builder
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true;
        state.isAuthenticated = false;
        state.isAuthenticating = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.isAuthenticating = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.isAuthenticating = false;
        state.user = null;
        state.token = null;
        state.error = action.payload;
      });

    // Update Profile
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setLoading } = authSlice.actions;
export default authSlice.reducer; 