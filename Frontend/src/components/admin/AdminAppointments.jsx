import React from 'react';
import AdminSidebar from './AdminSidebar';

const AdminAppointments = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50">
      <AdminSidebar />
      <div className="ml-64 px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
        <p className="text-gray-600 mt-2">Manage all appointments</p>
        <div className="mt-8 bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-blue-50 to-cyan-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Doctor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No appointments found
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAppointments;
