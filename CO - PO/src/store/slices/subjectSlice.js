import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {api} from "../reqURL"

// Subject API Calls
export const fetchSubjects = createAsyncThunk(
  'subjects/fetchSubjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/subjects');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);

export const getSubject = createAsyncThunk(
  'subjects/getSubject',
  async(id, { rejectWithValue, getState })=>{
    try {
      const { isAuthenticated } = getState()
      if (isAuthenticated) {
        return;
      }
      const response = await api.get(`/api/subjects/subjectInfo/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong');
    }

  }
)

// Course Outcome API Calls
export const fetchCO = createAsyncThunk(
  'cos/fetchCO',
  async (subjectId, { getState, rejectWithValue }) => {
    try {
      const { isAuthenticating } = getState().auth;
      const { isSubjectFetched } = getState().subjects;
      if (isAuthenticating && !isSubjectFetched) {
        return;
      }
      const response = await api.get(`api/cos/subject/${subjectId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);

const subjectSlice = createSlice({
  name: 'subjects',
  initialState: {
    subjects: [],
    loading: false,
    error: null,
    isSubjectFetched: false,
    isSubjectFetching: false,
    isCOFetched: false,
    loadingCO: false,
    errorCO: null,
    currentSubject: {name:"", semester:"", branch: "", co: null, id: null},
  },
  reducers: {
    clearSubjectError: (state) => {
      state.error = null;
    },
    setCurrentSubject: (state, action) => {
      if (action.payload !== undefined) {
        state.currentSubject = action.payload;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch CO
      .addCase(fetchCO.pending, (state) => {
        state.loadingCO = true;
        state.errorCO = null;
        state.isCOFetched = false;
      })
      .addCase(fetchCO.fulfilled, (state, action) => {
        state.loadingCO = false;
        if (action.payload !== undefined) {
          state.currentSubject.co = action.payload;
        }
        state.isCOFetched = true;
      })
      .addCase(fetchCO.rejected, (state, action) => {
        state.isCOFetched = true;
        state.loadingCO = false;
        state.errorCO = action.payload || "Failed to fetch CO";
      })

      // Fetch subjects
      .addCase(fetchSubjects.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isSubjectFetched = false;
        state.isSubjectFetching = true;
      })
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects = action.payload.data;
        state.isSubjectFetched = true;
        state.isSubjectFetching = false;
      })
      .addCase(fetchSubjects.rejected, (state, action) => {
        state.loading = false;
        state.isSubjectFetched = true;
        state.isSubjectFetching = false;
        state.error = action.payload || 'Failed to fetch subjects';
      })

      // Get subjects
      .addCase(getSubject.pending, (state)=>{
        state.loadingSubjectInfo = true;
        state.error = null;
      })
      .addCase(getSubject.fulfilled, (state, action)=>{
        // state.currentSubject = action.payload
        state.loadingSubjectInfo = false
      })
      .addCase(getSubject.rejected, (state, action)=>{
        state.loadingSubjectInfo = false
        state.error = action.payload || "Failed to fetch subject's info."
      })
  }
});

export const { clearSubjectError, setCurrentSubject } = subjectSlice.actions;

export default subjectSlice.reducer;