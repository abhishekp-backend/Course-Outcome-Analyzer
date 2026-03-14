import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../reqURL"

const API_BASE_URL = import.meta.env.VITE_API

// Login user
export const loginUser = createAsyncThunk("auth/loginUser", async (credentials, thunkAPI) => {
  try {
    await api.post("/api/auth/login", {
      ...credentials,
      role: "ADMIN-Manager"
    })
    return true;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.errors[0].message);
  }
});

export const logoutUser = createAsyncThunk("auth/logoutUser", async (thunkAPI) => {
  try {
    await api.post("/api/auth/logout")
    return true;
  }
  catch(error) {
    return thunkAPI.rejectWithValue(error.response.data.errors[0].message)
  }
})

export const checkAuth = createAsyncThunk("auth/checkAuth", async(thunkAPI) => {
  try {
    await api.get("/api/auth/profile")
    return true;
  }
  catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.errors[0].message)
  }
})

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  authVerified: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })
      .addCase(checkAuth.pending, (state) => {
        state.authVerified = false
        state.isAuthenticated = false
      })
      .addCase(checkAuth.fulfilled, (state) => {
        state.authVerified = true
        state.isAuthenticated = true
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.authVerified = true
        state.error = action.payload
        state.isAuthenticated = false
      })
  },
});

export default authSlice.reducer;
