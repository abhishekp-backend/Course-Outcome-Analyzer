import React, { useEffect } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Header from "./Layout/Header"

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, checkAuth, isAuthenticating } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated && !isAuthenticating) {
      checkAuth();
    }
  }, [isAuthenticated, checkAuth]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && loading && location.pathname !== "/") {
    return <Navigate to="/" />
  }

  return (
    <div>
      <Header />
      <Outlet />
    </div>
  )
};

export default ProtectedRoute; 