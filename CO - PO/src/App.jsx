import React, { useEffect } from "react";
import Login from "./Components/Authentication/Login";
import Signup from "./Components/Authentication/Signup";
import Dashboard from "./Components/Dashboard/Dashboard/index";
import ProtectedRoute from "./Components/ProtectedRoute";
import TestModal from "./Components/TestModal";
import { Routes, Route } from "react-router-dom";
import { SubjectInfo } from "./Components/Subject/index";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearFetchedStudent } from "./store/slices/studentSlice";
import { useAuth } from "./hooks/useAuth";
import { Toaster } from "react-hot-toast";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { checkAuth, isAuthenticated, isAuthenticating } = useAuth();

  useEffect(() => {
    if (!isAuthenticated && !isAuthenticating) {
      checkAuth();
    }
  }, [location, dispatch]);
  return (
    <div className="h-screen w-screen">
      <Toaster position="top-center" toastOptions={{style : {
        marginTop: "20px",
      }}} />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/test-modal" element={<TestModal />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/subject/:id" element={<SubjectInfo />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
