import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../reqURL';

/* ================= FETCH BRANCHES ================= */

export const fetchBranches = createAsyncThunk(
  'branch/fetchBranches',
  async ({ filter }, { rejectWithValue }) => {
    try {
      const res = await api.post('/api/branch/getBranches', { filter });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || 'Failed to fetch branches'
      );
    }
  }
);

/* ================= CREATE BRANCH ================= */

export const createBranch = createAsyncThunk(
  'branch/createBranch',
  async ({ name }, { rejectWithValue, dispatch, getState }) => {
    try {
      const state = getState();
      const res = await api.post('/api/branch/createBranch', {
        name,
        academicYear: state.academicYear.academicId
      });
      dispatch(fetchBranches({ filter: {} }));
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || 'Failed to create branch'
      );
    }
  }
);

/* ================= SLICE ================= */

const initialState = {
  branches: [],
  loading: false,
  isFetched: false,
  error: null
};

const branchSlice = createSlice({
  name: 'branch',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      /* ---------- FETCH ---------- */
      .addCase(fetchBranches.pending, state => {
        state.loading = true;
        state.error = null;
        state.isFetched = false;
      })
      .addCase(fetchBranches.fulfilled, (state, action) => {
        state.branches = action.payload.branches;
        state.loading = false;
        state.isFetched = true;
      })
      .addCase(fetchBranches.rejected, (state, action) => {
        state.loading = false;
        state.isFetched = true;
        state.branches = [];
        state.error = action.payload;
      })

      /* ---------- CREATE ---------- */
      .addCase(createBranch.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBranch.fulfilled, (state, action) => {
        state.loading = false;
        state.branches.push(action.payload.branch);
      })
      .addCase(createBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { resetBranchState } = branchSlice.actions;
export default branchSlice.reducer;
