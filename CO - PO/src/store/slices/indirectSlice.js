import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../reqURL";

const initialState = {
  data: null,
  loading: false,
  error: null,
};

// --------------------------------
// Fetch indirect values
// --------------------------------
export const fetchIndirect = createAsyncThunk(
  "indirect/fetchIndirect",

  async (classId, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/api/indirect/${classId}`
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch indirect assessment"
      );
    }
  }
);

const indirectSlice = createSlice({
  name: "indirect",

  initialState,

  reducers: {
    clearIndirect(state) {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // -----------------------------
      // Fetch pending
      // -----------------------------
      .addCase(fetchIndirect.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // -----------------------------
      // Fetch successful
      // -----------------------------
      .addCase(fetchIndirect.fulfilled, (state, action) => {
        state.loading = false;

        // Backend:
        // {
        //   success: true,
        //   data: {...}
        // }
        state.data = action.payload.data;
      })

      // -----------------------------
      // Fetch failed
      // -----------------------------
      .addCase(fetchIndirect.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to fetch indirect assessment";
      });
  },
});

export const {
  clearIndirect,
} = indirectSlice.actions;

export default indirectSlice.reducer;