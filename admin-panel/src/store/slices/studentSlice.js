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
    const res = await api.delete(`/api/students/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const uploadExcel = createAsyncThunk(
  "students/uploadExcel",
  async ({file, id}, { rejectWithValue, getState }) => {
    try {
      const state = getState()
      if (!file) return rejectWithValue("No file selected");
      let classId = JSON.parse(id);
      const fd = new FormData();
      fd.append("file", file);
      fd.append("id", id);
      fd.append("academicId", state.academicYear.academicId)
      fd.append("classId", classId.classId)

      const response = await api.post("/api/students/upload-excel", fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      return response.data; // return data to reducer
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);


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

      .addCase(uploadExcel.pending, state=>{
        state.loading = true;
        state.error = null;
        console.log("Uploading")
      })
      .addCase(uploadExcel.fulfilled, (state) => {
        state.loading = false;
        state.error = null
      })
      .addCase(uploadExcel.rejected, (state) => {
        state.loading = false;
        state.error = null
        console.log("Uploading failed")
      });
  },
});

export default studentsSlice.reducer;
