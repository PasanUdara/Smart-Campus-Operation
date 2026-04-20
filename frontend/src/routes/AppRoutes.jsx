import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// 🏠 Maintenance Pages Import
import Home from '../pages/Home';
import TicketCreate from '../pages/Maintenance/TicketCreate';
import TicketList from '../pages/Maintenance/TicketList';

const AppRoutes = () => {
  return (
    <Routes>
      {/* 1. ප්‍රධාන හෝම් පේජ් එක */}
      <Route path="/" element={<Home />} />
      
      {/* 2. ටිකට් එකක් Create කරන පේජ් එක */}
      <Route path="/report-fault" element={<TicketCreate />} />
      
      {/* 3. ටිකට් ඔක්කොම පේන ලිස්ට් එක (Admin/Staff) */}
      <Route path="/admin/tickets" element={<TicketList />} />

      {/* වැරදි Path එකක් ගැහුවොත් Home එකට යවන්න */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;