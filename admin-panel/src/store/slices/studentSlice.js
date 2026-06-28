import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {api} from "../reqURL"

export const fetchStudents = createAsyncThunk("students/fetchStudents", async (filter, { rejectWithValue, getState }) => {
  try {
    const state = getState();
    const res = await api.get(`/api/students/${state.academicYear.currentYear}/`);
    return await res.json();
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const addStudent = createAsyncThunk("students/addStudent", async (data, { rejectWithValue }) => {
  try {
    const res = await api.post(`http://localhost:5000/api/students`, {
      data
    });
    return await res.json();
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const updateStudent = createAsyncThunk("students/updateStudent", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/api/students/${id}`, {
      data
    });
    return await res.json();
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const deleteStudent = createAsyncThunk("students/deleteStudent", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/api/students/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});


const studentsSlice = createSlice({
  name: "students",
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchStudents.fulfilled, (state, action) => { state.list = action.payload; state.loading = false; })
      .addCase(fetchStudents.rejected, (state, action) => { state.error = action.payload; state.loading = false; })

      .addCase(addStudent.fulfilled, (state, action) => { state.list.push(action.payload); })
      .addCase(addStudent.rejected, (state, action) => { state.error = action.payload; })

      .addCase(updateStudent.fulfilled, (state, action) => {
        const index = state.list.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(updateStudent.rejected, (state, action) => { state.error = action.payload; })

      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.list = state.list.filter((s) => s.id !== action.payload);
      })
      .addCase(deleteStudent.rejected, (state, action) => { state.error = action.payload; })
  },
});

export default studentsSlice.reducer;
