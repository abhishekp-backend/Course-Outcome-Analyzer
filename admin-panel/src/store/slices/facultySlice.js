import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../reqURL";

// Fetch faculty
export const fetchFaculty = createAsyncThunk(
  "faculty/fetchFaculty",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/auth/getFaculties`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

// Add faculty
export const addFaculty = createAsyncThunk(
  "faculty/addFaculty",
  async ({ username, email, subject }, { rejectWithValue, getState }) => {
    try {
      // simple deterministic password generator
      const state = getState();
      const password = `${username}@${state.academicYear.currentYear}`;
      console.log(state.academicYear.currentYear);
      const res = await api.post("/api/auth/register", {
        username,
        email,
        password,
        year: state.academicYear.currentYear,
        subject,
      });

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

// Update faculty
export const updateFaculty = createAsyncThunk(
  "faculty/updateFaculty",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/api/faculty/${id}`, {
        data,
      });
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

// Delete faculty
export const deleteFaculty = createAsyncThunk(
  "faculty/deleteFaculty",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/api/faculty/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

const facultySlice = createSlice({
  name: "faculty",
  initialState: {
    faculties: [],
    length: 0,
    loading: false,
    isFetched: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFaculty.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isFetched = false;
      })
      .addCase(fetchFaculty.fulfilled, (state, action) => {
        state.faculties = action.payload;
        state.loading = false;
        state.isFetched = true;
        state.length = action.payload.length;
      })
      .addCase(fetchFaculty.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        state.isFetched = true;
      })

      .addCase(addFaculty.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(addFaculty.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(updateFaculty.fulfilled, (state, action) => {
        const index = state.list.findIndex((f) => f.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(updateFaculty.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(deleteFaculty.fulfilled, (state, action) => {
        state.list = state.list.filter((f) => f.id !== action.payload);
      })
      .addCase(deleteFaculty.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default facultySlice.reducer;
