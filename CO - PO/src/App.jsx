import React, { useState, useEffect, useRef } from "react";
import Login from "./Components/Authentication/Login";
import "./App.css"
import Signup from "./Components/Authentication/Signup";
import Dashboard from "./Components/Dashboard/Dashboard/index";
import ProtectedRoute from "./Components/ProtectedRoute";
import TestModal from "./Components/TestModal";
import { Routes, Route, useNavigate } from "react-router-dom";
import { SubjectInfo } from "./Components/Subject/index";
import { useLocation } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { Toaster } from "react-hot-toast";

function App() {
  const location = useLocation();
  const navigation = useNavigate();
  const { checkAuth, isAuthenticated, isAuthenticating } = useAuth();
  const [isSearched, setSearched] = useState(false);

  const prnInputRef = useRef(null);

  useEffect(() => {
    const runAuthCheck = async () => {
      if (!isAuthenticated && !isAuthenticating) {
        const isValid = await checkAuth();

        if (!isValid && location.pathname !== "/") {
          navigation("/");
        }
      }
    };

    runAuthCheck();
  }, [location]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const targetTag = event.target.tagName;
      if (targetTag === "INPUT" || targetTag === "TEXTAREA") {
        return;
      }

      const pressedKey = event.key.toLowerCase();
      const isCtrlOrCmd = event.ctrlKey || event.metaKey;

      if (pressedKey === "s" || (isCtrlOrCmd && pressedKey === "f")) {
        event.preventDefault();

        if (prnInputRef.current) {
          prnInputRef.current.focus();
          prnInputRef.current.select();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  return (
    <div className="h-screen w-screen">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            marginTop: "20px",
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/test-modal" element={<TestModal />} />
        <Route
          element={
            <ProtectedRoute
              isSearched={isSearched}
              setSearched={setSearched}
              searchInputRef={prnInputRef}
            />
          }
        >
          <Route
            path="/dashboard"
            element={
              <Dashboard isSearched={isSearched} setSearched={setSearched} />
            }
          />
          <Route path="/subject/:id" element={<SubjectInfo />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
