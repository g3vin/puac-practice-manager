// LockedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from './UserContext';

const LockedRoute = ({ children }) => {
    const { userId, loading } = useUser();

    if (loading) return <p>Loading...</p>; // Show a loading state while checking auth
    return userId ? children : <Navigate to="/login" />;
};

export default LockedRoute;