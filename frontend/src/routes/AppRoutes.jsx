import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// ඔයාගේ Maintenance Pages Import කරගැනීම
// import TicketCreate from '../pages/Maintenance/TicketCreate';
// import TicketList from '../pages/Maintenance/TicketList';
import ResourceList from "../pages/Resources/ResourceList";
import ResourceCreate from "../pages/Resources/ResourceCreate";
import ResourceEdit from "../pages/Resources/ResourceEdit";
// 🏠 Maintenance Pages Import (Path Changed to components)
import Home from '../pages/Home';
import TicketCreate from '../Components/Maintenance/TicketCreate';
import TicketList from '../Components/Maintenance/TicketList';

const AppRoutes = () => {
  return (
    <Routes>
      
      <Route path="/" element={<Home />} />
      
      
      <Route path="/report-fault" element={<TicketCreate />} />
      
      
      <Route path="/admin/tickets" element={<TicketList />} />

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