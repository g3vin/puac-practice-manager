import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from './UserContext';

const LockedRoute = ({ children }) => {
    const { userId, loading } = useUser();

    if (loading) return <p>Loading...</p>;
    return userId ? children : <Navigate to="/login" />;
};

export default LockedRoute;