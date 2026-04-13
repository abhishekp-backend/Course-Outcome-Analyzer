import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../reqURL";

/* ===================== THUNKS ===================== */

// Fetch all classes/sections
export const fetchClasses = createAsyncThunk(
  "class/fetchClasses",
  async (filter, { rejectWithValue }) => {
    try {
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
      const res = await api.post("/api/class/createClass", {
        academicYearId: state.academicYear.academicId,
        subjectId,
        facultyId,
        division: division.toUpperCase(),
        semester: semester,
        branchId: branch,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to create class");
    }
  }
);

/* ===================== INITIAL STATE ===================== */

const initialState = {
  classes: [],
  loading: {
    fetch: false,
    create: false
  },
  length: 0,
  error: {
    fetch: null,
    create: null
  }
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
        state.loading.fetch = true;
        state.error.fetch = null;
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.classes = action.payload.data;
        state.length = action.payload.data.length;
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.loading.fetch = false;
        state.classes = [];
        state.error.fetch = action.payload;
      })

      /* ---------- CREATE ---------- */
      .addCase(createClass.pending, (state) => {
        state.loading.fetch = true;
        state.loading.create = true;
        state.error.create = true;
      })
      .addCase(createClass.fulfilled, (state, action) => {
        state.loading.create = false;
        state.loading.fetch = false;
        state.classes.push(action.payload.data);
      })
      .addCase(createClass.rejected, (state, action) => {
        state.loading.create = false;
        state.error.create = action.payload;
      });
  }
});

export const { resetClassState } = classSlice.actions;
export default classSlice.reducer;