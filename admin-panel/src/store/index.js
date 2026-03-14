import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import studentsReducer from "./slices/studentSlice";
import facultyReducer from "./slices/facultySlice";
import subjectsReducer from "./slices/subjectsSlice";
import academicYearReducer from "./slices/academicYearSlice";
import branchesReducer from "./slices/branchSlice";
import classReducer from "./slices/classSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    class: classReducer,
    students: studentsReducer,
    faculty: facultyReducer,
    subjects: subjectsReducer,
    academicYear: academicYearReducer,
    branch: branchesReducer,
  },
});
