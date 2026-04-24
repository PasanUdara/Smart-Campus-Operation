import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';  // Nisidu- Import ProtectedRoute
import OAuthCallback from '../pages/OAuthCallback';

// Resource Pages
import ResourceList from "../pages/Resources/ResourceList";
import ResourceCreate from "../pages/Resources/ResourceCreate";
import ResourceEdit from "../pages/Resources/ResourceEdit";

// General & Auth Pages
import Home from '../pages/Home';
import Login from '../pages/Login'; 
import AdminPanel from '../pages/AdminPanel'; 

// Booking Pages
import BookingPage from '../pages/Bookings/BookingPage';
import AdminBookings from '../pages/Bookings/AdminBookings';

// Maintenance Components
import TicketCreate from '../components/Maintenance/TicketCreate';
import TicketList from '../components/Maintenance/TicketList';
import TechnicianTicketList from '../components/Maintenance/TechnicianTicketList';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Route - Login */}
      <Route path="/login" element={<Login />} />  {/* Nisidu- Login route */}

      {/* OAuth Callback Route */}
      <Route path="/oauth-callback" element={<OAuthCallback />} />
      
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/report-fault" 
        element={
          <ProtectedRoute>
            <TicketCreate />
          </ProtectedRoute>
        } 
      />
      
      {/* Booking Routes */}
      <Route 
        path="/booking" 
        element={
          <ProtectedRoute>
            <BookingPage />
          </ProtectedRoute>
        }
      />

      <Route 
        path="/admin/bookings" 
        element={
          <ProtectedRoute adminOnly={true}>
            <AdminBookings />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/admin/tickets" 
        element={
          <ProtectedRoute adminOnly={true}>
            <TicketList />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/admin/users" 
        element={
          <ProtectedRoute adminOnly={true}>
            <AdminPanel />
          </ProtectedRoute>
        } 
      />

      <Route path="/resources" element={<ResourceList />} />
      <Route path="/resources/create" element={<ResourceCreate />} />
      <Route path="/resources/edit/:id" element={<ResourceEdit />} />
      
<Route 
    path="/my-tickets" 
    element={
        <ProtectedRoute technicianOnly={true}>
            <TechnicianTicketList />
        </ProtectedRoute>
    } 
/>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;