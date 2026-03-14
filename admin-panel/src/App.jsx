import {useEffect} from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./Components/Auth/Login";
import DashboardLayout from "./Components/Dashboard/DashboardLayout";
import Dashboard from "./Components/Dashboard/Dashboard";
import ManageSubjects from "./Components/Dashboard/ManageSubjects";
import ManageFaculty from "./Components/Dashboard/ManageFaculty";
import ManageStudents from "./Components/Dashboard/ManageStudents";
import ManageBranches from "./Components/Dashboard/ManageBranches";
import ManageAcademicYears from "./Components/Dashboard/ManageAcademicYears";
import ManageClasses from "./Components/Dashboard/ManageClasses";
import { checkAuth } from "./store/slices/authSlice";
import { fetchFaculty } from "./store/slices/facultySlice"
import { fetchAcademicSubjects } from "./store/slices/subjectsSlice"
import { fetchBranches } from "./store/slices/branchSlice"
import { fetchAcademicYears } from "./store/slices/academicYearSlice"
import { useDispatch } from "react-redux"

function ProtectedRoute({ children }) {
  const dispatch = useDispatch()
  useEffect(()=>{
    dispatch(checkAuth())
  }, [dispatch])
  const { isAuthenticated, authVerified } = useSelector((state) => state.auth);
  return authVerified ? (isAuthenticated ? children : <Navigate to="/" />) : <div className="absolute left-[48%] top-[45%]"><span className="font-bold text-gray-400">Loading...</span></div>;
}

export default function App() {
  const dispatch = useDispatch()
  const {academicId} = useSelector((state) => state.academicYear)
  useEffect(() => {
    dispatch(fetchAcademicYears())
    if (academicId !== "") {
      dispatch(fetchAcademicSubjects())
    }
    dispatch(fetchFaculty())
    dispatch(fetchBranches({}))
  }, [])
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* All dashboard routes share the layout */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="subjects" element={<ManageSubjects />} />
          <Route path="faculty" element={<ManageFaculty />} />
          <Route path="students" element={<ManageStudents />} />
          <Route path="branches" element={<ManageBranches />} />
          <Route path="classes" element={<ManageClasses />} />
          <Route path="academic-years" element={<ManageAcademicYears />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
