import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, hasAccess } from "../../utils/auth";

const ProtectedRoute = ({ children, allowedRoles }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  if (!hasAccess(allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
