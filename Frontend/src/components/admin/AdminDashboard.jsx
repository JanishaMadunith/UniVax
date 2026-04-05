import React from 'react';
import AdminSidebar from './AdminSidebar';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50">
      <AdminSidebar />
      <div className="ml-64 px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to the admin panel</p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-b-4 border-teal-500 hover:shadow-xl transition-all">
            <h3 className="text-lg font-semibold text-gray-900">Users</h3>
            <p className="text-4xl font-bold text-teal-600 mt-2">0</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border-b-4 border-cyan-500 hover:shadow-xl transition-all">
            <h3 className="text-lg font-semibold text-gray-900">Clinics</h3>
            <p className="text-4xl font-bold text-cyan-600 mt-2">0</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border-b-4 border-blue-500 hover:shadow-xl transition-all">
            <h3 className="text-lg font-semibold text-gray-900">Appointments</h3>
            <p className="text-4xl font-bold text-blue-600 mt-2">0</p>
          </div>
          <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl shadow-lg p-6 text-white hover:shadow-xl transition-all">
            <h3 className="text-lg font-semibold">Reports</h3>
            <p className="text-4xl font-bold mt-2">0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
