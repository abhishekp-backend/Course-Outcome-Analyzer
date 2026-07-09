import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../reqURL";

/* ===================== THUNKS ===================== */

// Fetch all classes/sections
export const fetchClasses = createAsyncThunk(
  "class/fetchClasses",
  async (filter, { rejectWithValue, getState }) => {
    try {
      const state = getState().class;
      if (state.fetched) {
        return state.classes;
      }
      const res = await api.post("/api/class/fetchClasses", {
        ...filter
      });
      return res.data; // array of class objects
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch classes");
    }
  }
);

// Create new class/section
export const createClass = createAsyncThunk(
  "class/createClass",
  async ({ subjectId, division, facultyId, semester, branch }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      state.creatingClass = true;
      const res = await api.post("/api/class/createClass", {
        academicYearId: state.academicYear.academicId,
        subjectId,
        facultyId,
        division: division.toUpperCase(),
        semester: semester,
        branchId: branch,
      });
      state.creatingClass = false;
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to create class");
    }
  }
);

/* ===================== INITIAL STATE ===================== */

const initialState = {
  classes: [],
  loading: true,
  creatingClass: false,
  fetched: true,
  length: 0,
};

/* ===================== SLICE ===================== */

const classSlice = createSlice({
  name: "class",
  initialState,
  reducers: {
    resetClassState: () => initialState
  },
  extraReducers: (builder) => {
    builder
      /* ---------- FETCH ---------- */
      .addCase(fetchClasses.pending, (state) => {
        state.loading = true;
        state.fetched = false;
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.fetched = true;
        state.loading = false;
        state.classes = action.payload?.data;
        state.length = state.classes?.length || 0;
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.fetched = false;
        state.loading = false;
        state.classes = [];
        state.error = action.payload;
      })

      /* ---------- CREATE ---------- */
      .addCase(createClass.pending, (state) => {
        state.loading = true;
        state.fetched = false; 
      })
      .addCase(createClass.fulfilled, (state, action) => {
        state.fetched = true;
        state.loading = false;
        state.classes.push(action.payload.data);
      })
      .addCase(createClass.rejected, (state, action) => {
        state.fetched = false;
        state.loading = false;
        state.error.create = action.payload;
      });
  }
});

export const { resetClassState } = classSlice.actions;
export default classSlice.reducer;