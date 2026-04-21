import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// ඔයාගේ Maintenance Pages Import කරගැනීම
import TicketCreate from '../pages/Maintenance/TicketCreate';
import TicketList from '../pages/Maintenance/TicketList';
import ResourceList from "../pages/Resources/ResourceList";
import ResourceCreate from "../pages/Resources/ResourceCreate";
import ResourceEdit from "../pages/Resources/ResourceEdit";

const AppRoutes = () => {
  return (
    <Routes>
      {/* පටන් ගන්න කොටම කෙලින්ම Fault Report පේජ් එකට යවමු */}
      <Route path="/" element={<Navigate to="/report-fault" />} />
      
      {/* User පේජ් එක: ටිකට් එකක් දාන තැන */}
      <Route path="/report-fault" element={<TicketCreate />} />
      
      {/* Admin/Technician පේජ් එක: ටිකට් කළමනාකරණය කරන Dashboard එක */}
      <Route path="/admin/tickets" element={<TicketList />} />

      {/* අනාගතයේදී අනිත් සාමාජිකයන්ගේ පේජ් මෙතනට ඇඩ් කළ හැක */}
      {/* <Route path="/assets" element={<AssetCatalogue />} /> */}

      <Route path="/resources" element={<ResourceList />} />
      <Route path="/resources/create" element={<ResourceCreate />} />
      <Route path="/resources/edit/:id" element={<ResourceEdit />} />
    </Routes>
  );
};

export default AppRoutes;