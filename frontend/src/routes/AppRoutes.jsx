import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// 🏠 Maintenance Pages Import (Path Changed to components)
import Home from '../pages/Home';
import TicketCreate from '../components/Maintenance/TicketCreate';
import TicketList from '../components/Maintenance/TicketList';

const AppRoutes = () => {
  return (
    <Routes>
      
      <Route path="/" element={<Home />} />
      
      
      <Route path="/report-fault" element={<TicketCreate />} />
      
      
      <Route path="/admin/tickets" element={<TicketList />} />

      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;