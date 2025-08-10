import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../component/Pages/Sidebar';
import TopNavbar from '../component/Navbar/Navbar';

const DashboardLayout = () => {
  return (
    <div>
      <TopNavbar />
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1 p-4" style={{ marginLeft: '250px', marginTop: '60px', width: '100%', minHeight: '100vh', }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
