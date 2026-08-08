import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { authService } from '../services/authService';

export const ProtectedRoute = ({ allowedRoles = [] }) => {
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getCurrentUser();
  const userRole = user?.role?.toLowerCase();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && userRole && !allowedRoles.includes(userRole)) {
    // Redirect to user's proper dashboard if trying to access unauthorized route
    if (userRole === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (userRole === 'alumni') return <Navigate to="/alumni/dashboard" replace />;
    return <Navigate to="/student/dashboard" replace />;
  }

  return <Outlet />;
};
