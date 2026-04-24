import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Loader from './Loader';

const ProtectedRoute = ({ children, adminOnly = false, technicianOnly = false  }) => {
    const { isAuthenticated, isAdmin,isTechnician, loading } = useAuth();

    if (loading) {
        return <Loader />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (adminOnly && !isAdmin()) {
        return <Navigate to="/" />;
    }
     
    if (technicianOnly && !isTechnician() && !isAdmin()) {
        return <Navigate to="/" />;
    }
    
    return children;
};

export default ProtectedRoute;