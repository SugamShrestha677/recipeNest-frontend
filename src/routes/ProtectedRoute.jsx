import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  // IMPORTANT: Show loading spinner while checking authentication
  // Don't redirect until loading is complete
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  // Only redirect after loading is complete and user is still null
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;