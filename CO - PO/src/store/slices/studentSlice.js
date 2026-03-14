import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../reqURL";

// Async thunks for API calls
export const fetchStudentsBySubject = createAsyncThunk(
  "students/fetchStudents",
  async (subjectID, { rejectWithValue }) => {
    try {
      const year = new Date().getFullYear().toString()
      console.log(subjectID, year)
      const response = await api.post(`api/students/getStudents?class=${subjectID}&year=${year}`);

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || "Failed to fetch students");
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

export const addStudent = createAsyncThunk(
  "students/addStudent",
  async (studentData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await fetch("http://localhost:5000/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(studentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || "Failed to add student");
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

export const updateStudentMarks = createAsyncThunk(
  "students/updateStudent",
  async (id, { rejectWithValue, getState }) => {
    try {
      const { auth, students } = getState();
      const response = await fetch(`http://localhost:5000/api/students/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ id, data: students.updating }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || "Failed to update student");
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

export const deleteStudent = createAsyncThunk(
  "students/deleteStudent",
  async (id, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await fetch(`http://localhost:5000/api/students/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || "Failed to delete student");
      }

      return id;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

export const fetchStudentByPRN = createAsyncThunk(
  "students/fetchStudentByPRN",
  async ({ prn, subject }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await fetch(
        `http://localhost:5000/api/students/getStudent`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prn: prn, subjectID: subject }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || "Failed to fetch students");
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

export const uploadExcel = createAsyncThunk(
  "students/uploadExcel",
  async ({ files, id }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      if (!files) return alert("Pick a file");
      const fd = new FormData();
      fd.append("file", files);
      fd.append("id", id) 
      const response = await fetch("/api/students/upload-excel", {
        method: "POST",
        headers:{
          Authorization: `Bearer ${auth.token}`
        },
        body: fd,
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      window.location.reload()
    } catch (error) {
      console.log(error)
      return rejectWithValue(error.message || "Something went wrong!")
    }
  }
);

const studentSlice = createSlice({
  name: "students",
  initialState: {
    students: [],
    updating: {},
    loading: false,
    error: null,
    singleStudent: [],
    targetStudents: {
      branch: "",
      divison: "",
    }
  },
  reducers: {
    clearStudentError: (state) => {
      state.error = null;
    },
    insertUpdatingStudent: (state, action) => {
      const payload = action.payload;
      for (let key in payload) {
        state.updating[key] = payload[key];
      }
    },
    clearSingleStudent: (state) => {
      state.singleStudent = [];
    },
    clearFetchedStudent: (state) => {
      state.students = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch students
      .addCase(fetchStudentsBySubject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentsBySubject.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload;
      })
      .addCase(fetchStudentsBySubject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch students";
      })

      // Add student
      .addCase(addStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.students.push(action.payload);
      })
      .addCase(addStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add student";
      })

      // Update student
      .addCase(updateStudentMarks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStudentMarks.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.students.findIndex(
          (student) => student._id === action.payload._id
        );
        if (index !== -1) {
          state.students[index] = action.payload;
        }
      })
      .addCase(updateStudentMarks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update student";
      })

      // Delete student
      .addCase(deleteStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.students = state.students.filter(
          (student) => student._id !== action.payload
        );
      })
      .addCase(deleteStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete student";
      })

      // Get one student
      .addCase(fetchStudentByPRN.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentByPRN.fulfilled, (state, action) => {
        state.singleStudent = action.payload;
        state.loading = false;
      })
      .addCase(fetchStudentByPRN.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch a student!";
      })
      .addCase(uploadExcel.pending, state=>{
        state.loading = true;
        state.error = null
      })
      .addCase(uploadExcel.fulfilled, (state) => {
        state.loading = false;
        state.error = null
      })
      .addCase(uploadExcel.rejected, (state) => {
        state.loading = false;
        state.error = null
      })
  },
});

export const {
  clearStudentError,
  insertUpdatingStudent,
  clearSingleStudent,
  clearFetchedStudent,
} = studentSlice.actions;

export default studentSlice.reducer;
