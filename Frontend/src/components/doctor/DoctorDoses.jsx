import React from 'react';
import DoctorSidebar from './DoctorSidebar';

const DoctorDoses = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50">
      <DoctorSidebar />
      <div className="ml-64 px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Doses</h1>
          <button className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all">
            Add Dose
          </button>
        </div>
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-blue-50 to-cyan-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Vaccine</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Dose Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Schedule</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                  No doses found
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DoctorDoses;
