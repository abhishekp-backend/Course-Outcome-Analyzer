import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {api} from "../reqURL"

// Fetch subjects
export const fetchAcademicSubjects = createAsyncThunk("subjects/fecthAcademicSubjects", async (_, { rejectWithValue, getState }) => {
  try {
    const state = getState()
    const res = await api.get(`/api/subjects/academic-year/${state.academicYear.academicId}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

// Add subject
export const addSubject = createAsyncThunk("subjects/addSubject", async (data, { rejectWithValue, getState }) => {
  try {
    const state = getState()

    const res = await api.post(`/api/subjects`, {
      ...data,
      year:state.academicYear.academicId
    });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

// Update subject
export const updateSubject = createAsyncThunk("subjects/updateSubject", async ({ id, data }, { rejectWithValue, dispatch }) => {
  try {
    const res = await api.put(`/api/subjects/${id}`, {
      data
    });
    dispatch(fetchAcademicSubjects())
    return await res.json();
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

// Delete subject
export const deleteSubject = createAsyncThunk("subjects/deleteSubject", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/api/subjects/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const subjectsSlice = createSlice({
  name: "subjects",
  initialState: { subjects: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAcademicSubjects.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAcademicSubjects.fulfilled, (state, action) => { state.subjects = action.payload.subjects; state.loading = false; })
      .addCase(fetchAcademicSubjects.rejected, (state, action) => { state.error = action.payload; state.loading = false; })

      .addCase(addSubject.fulfilled, (state, action) => { state.list.push(action.payload); })
      .addCase(addSubject.rejected, (state, action) => { state.error = action.payload; })

      .addCase(updateSubject.fulfilled, (state, action) => {
        const index = state.subjects.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(updateSubject.rejected, (state, action) => { state.error = action.payload; })

      .addCase(deleteSubject.fulfilled, (state, action) => {
        state.subjects = state.subjects.filter((s) => s.id !== action.payload);
      })
      .addCase(deleteSubject.rejected, (state, action) => { state.error = action.payload; });
  },
});

export default subjectsSlice.reducer;
