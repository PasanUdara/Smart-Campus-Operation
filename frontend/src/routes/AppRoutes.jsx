import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';  // Nisidu- Import ProtectedRoute
import OAuthCallback from '../pages/OAuthCallback';
// 🏠 Maintenance Pages Import (Path Changed to components)
import Home from '../pages/Home';
import Login from '../pages/Login';  // Nisidu- Import Login page
import AdminPanel from '../pages/AdminPanel';  // Nisidu- Import AdminPanel page
import TicketCreate from '../components/Maintenance/TicketCreate';
import TicketList from '../components/Maintenance/TicketList';

const AppRoutes = () => {
  return (
    <Routes>
        {/* Public Route - Login */}
      <Route path="/login" element={<Login />} />  {/* Nisidu- Login route */}

      {/* OAuth Callback Route - ADD THIS */}
      <Route path="/oauth-callback" element={<OAuthCallback />} />
      
      <Route path="/" element={  <ProtectedRoute><Home /></ProtectedRoute> } />
      
      
      <Route path="/report-fault" element={<ProtectedRoute><TicketCreate /></ProtectedRoute>} />
      
      
      <Route path="/admin/tickets" element={<ProtectedRoute adminOnly={true}><TicketList /></ProtectedRoute>} />

       <Route path="/admin/users" element={
        <ProtectedRoute adminOnly={true}>
          <AdminPanel />
        </ProtectedRoute>
      } />

      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;