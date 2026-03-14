import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks
export const fetchPOs = createAsyncThunk(
  'pos/fetchPOs',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await fetch('http://localhost:5000/api/pos', {
        headers: {
          'Authorization': `Bearer ${auth.token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to fetch POs');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);

export const createPO = createAsyncThunk(
  'pos/createPO',
  async (poData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await fetch('http://localhost:5000/api/pos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        },
        body: JSON.stringify(poData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to create PO');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);

export const updatePO = createAsyncThunk(
  'pos/updatePO',
  async ({ id, poData }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await fetch(`http://localhost:5000/api/pos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        },
        body: JSON.stringify(poData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to update PO');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);

export const deletePO = createAsyncThunk(
  'pos/deletePO',
  async (id, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await fetch(`http://localhost:5000/api/pos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${auth.token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to delete PO');
      }

      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);

const initialState = {
  pos: [],
  loading: false,
  error: null
};

const poSlice = createSlice({
  name: 'pos',
  initialState,
  reducers: {
    clearPOError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch POs
      .addCase(fetchPOs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPOs.fulfilled, (state, action) => {
        state.loading = false;
        state.pos = action.payload;
      })
      .addCase(fetchPOs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create PO
      .addCase(createPO.fulfilled, (state, action) => {
        state.pos.push(action.payload);
      })
      // Update PO
      .addCase(updatePO.fulfilled, (state, action) => {
        const index = state.pos.findIndex(po => po._id === action.payload._id);
        if (index !== -1) {
          state.pos[index] = action.payload;
        }
      })
      // Delete PO
      .addCase(deletePO.fulfilled, (state, action) => {
        state.pos = state.pos.filter(po => po._id !== action.payload);
      });
  }
});

export const { clearPOError } = poSlice.actions;
export default poSlice.reducer;

