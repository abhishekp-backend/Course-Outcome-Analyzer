import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../reqURL";

// Async thunks for API calls

export const uploadExcel = createAsyncThunk(
  "students/uploadExcel",
  async ({file, classId}, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      
      const selectedSubject = state.subjects?.subjects.find(s => s._id === classId);
      if (!file) return rejectWithValue("No file selected");
      let id = JSON.stringify({
        branch: selectedSubject.branch,
        division: selectedSubject.division
      });
      const fd = new FormData();
      fd.append("file", file);
      fd.append("id", id);
      fd.append("academicId", selectedSubject.academicId)
      fd.append("classId", classId);

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

export const fetchStudentsBySubject = createAsyncThunk(
  "students/fetchStudents",
  async ({ classId }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      if (state.students.fetched) {
        return {data: state.students};
      }
      const year = new Date().getFullYear().toString();
      const response = await api.post(`api/students/getStudents?class=${classId}&year=${year}`);
      
      if (!response.data.success) {
        const errorData = await response.message;
        return rejectWithValue(errorData.message || "Failed to fetch students");
      }
      return response.data;
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

const studentSlice = createSlice({
  name: "students",
  initialState: {
    students: [],
    updating: {},
    loading: false,
    fetched: false,
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
        state.fetched = false;
        state.error = null;
      })
      .addCase(fetchStudentsBySubject.fulfilled, (state, action) => {
        state.loading = false;
        state.fetched = true;
        state.students = action.payload.data;
      })
      .addCase(fetchStudentsBySubject.rejected, (state, action) => {
        state.loading = false;
        state.fetched = true;
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
