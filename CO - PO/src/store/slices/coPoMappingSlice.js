import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from "../reqURL"

// Async thunks
export const fetchMappings = createAsyncThunk(
  'coPoMappings/fetchMappings',
  async (subjectId, { rejectWithValue, getState }) => {
    try {
      const response = await api.get(`http://localhost:5000/api/co-po-mappings/subject/${subjectId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);


export const updateMapping = createAsyncThunk(
  'coPoMappings/updateMapping',
  async ({ id, correlationLevel }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await fetch(`http://localhost:5000/api/co-po-mappings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        },
        body: JSON.stringify({ correlationLevel })
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to update mapping');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);

export const deleteMapping = createAsyncThunk(
  'coPoMappings/deleteMapping',
  async (id, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await fetch(`http://localhost:5000/api/co-po-mappings/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${auth.token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to delete mapping');
      }

      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);

export const calculatePOAttainment = createAsyncThunk(
  'coPoMappings/calculatePOAttainment',
  async ({ subjectId, coAttainment }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await fetch(`http://localhost:5000/api/co-po-mappings/subject/${subjectId}/po-attainment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        },
        body: JSON.stringify({ coAttainment })
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to calculate PO attainment');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);

const initialState = {
  mappings: [],
  poAttainment: [],
  loading: false,
  error: null
};

const coPoMappingSlice = createSlice({
  name: 'coPoMappings',
  initialState,
  reducers: {
    clearMappingError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch mappings
      .addCase(fetchMappings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMappings.fulfilled, (state, action) => {
        state.loading = false;
        state.mappings = action.payload;
      })
      .addCase(fetchMappings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update mapping
      .addCase(updateMapping.fulfilled, (state, action) => {
        const index = state.mappings.findIndex(m => m._id === action.payload._id);
        if (index !== -1) {
          state.mappings[index] = action.payload;
        }
      })
      // Delete mapping
      .addCase(deleteMapping.fulfilled, (state, action) => {
        state.mappings = state.mappings.filter(m => m._id !== action.payload);
      })
      // Calculate PO Attainment
      .addCase(calculatePOAttainment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(calculatePOAttainment.fulfilled, (state, action) => {
        state.loading = false;
        state.poAttainment = action.payload;
      })
      .addCase(calculatePOAttainment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearMappingError } = coPoMappingSlice.actions;
export default coPoMappingSlice.reducer;

