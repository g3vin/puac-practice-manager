// ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const LockedRoute = ({ children, isAuthenticated }) => {
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default LockedRoute;
