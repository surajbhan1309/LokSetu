import React from 'react';
import Sidebar from '../components/Sidebar';

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto p-6 flex flex-col lg:flex-row gap-6">
        <Sidebar mode="admin" />
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;

