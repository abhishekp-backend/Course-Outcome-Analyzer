import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../reqURL';

export const fetchAcademicYears = createAsyncThunk(
  'academicYear/fetchAcademicYears',
  async (_, { rejectWithValue, getState }) => {
    try {
      const currentState = getState().academicYear;
      console.log(currentState)
      if (currentState.fetched) {
        return currentState.years;
      }
      const res = await api.post('/api/academic/getYears');
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || 'Failed to fetch academic years'
      );
    }
  }
);

export const createAcademicYear = createAsyncThunk(
  'academicYear/createAcademicYear',
  async (
    { year, label, startDate, endDate },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const res = await api.post('/api/academic/new', {
        year,
        label,
        startDate,
        endDate
      });
      dispatch(fetchAcademicYears())
      return res.data; // MUST return
    } catch (err) {
      return rejectWithValue(
        err.response?.data || 'Failed to create new academic year'
      );
    }
  }
);

const initialState = {
  years: [],
  length: 0,
  currentYear: null,
  loading: false,
  fetched: false,
  error: null,
  academicId: ""
};

const academicYearSlice = createSlice({
  name: 'academicYear',
  initialState,
  reducers: {
    resetAcademicYearState: () => initialState
  },
  extraReducers: builder => {
    builder
      /* ---------- FETCH ---------- */
      .addCase(fetchAcademicYears.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAcademicYears.fulfilled, (state, action) => {
        state.years = action.payload.academicYears;
        const currentYear = new Date().getFullYear().toString()
        for (let i in action.payload.academicYears) {
          let year = action.payload.academicYears[i].year
          if (year === currentYear) {
            state.currentYear = year
            state.academicId = action.payload.academicYears[i]._id
          }
        }
        state.fetched = true;
        state.length = state.years.length;
        state.loading = false;
      })
      .addCase(fetchAcademicYears.rejected, (state, action) => {
        state.loading = false;
        state.years = [];
        state.currentYear = null;
        state.error = action.payload;
      })

      /* ---------- CREATE ---------- */
      .addCase(createAcademicYear.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAcademicYear.fulfilled, (state, action) => {
        state.loading = false;
        state.years.push(action.payload);

        // If backend marks new year as active
        if (action.payload?.isActive) {
          state.currentYear = action.payload;
        }
      })
      .addCase(createAcademicYear.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { resetAcademicYearState } = academicYearSlice.actions;
export default academicYearSlice.reducer;
