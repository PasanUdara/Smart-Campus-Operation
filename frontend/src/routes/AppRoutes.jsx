import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';  // Nisidu- Import ProtectedRoute
import OAuthCallback from '../pages/OAuthCallback';

// ඔයාගේ Maintenance Pages Import කරගැනීම

import ResourceList from "../pages/Resources/ResourceList";
import ResourceCreate from "../pages/Resources/ResourceCreate";
import ResourceEdit from "../pages/Resources/ResourceEdit";
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

      {/* අනාගතයේදී අනිත් සාමාජිකයන්ගේ පේජ් මෙතනට ඇඩ් කළ හැක */}
      {/* <Route path="/assets" element={<AssetCatalogue />} /> */}

      <Route path="/resources" element={<ResourceList />} />
      <Route path="/resources/create" element={<ResourceCreate />} />
      <Route path="/resources/edit/:id" element={<ResourceEdit />} />
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;