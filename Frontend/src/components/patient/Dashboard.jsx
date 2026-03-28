import React from 'react';
import TopNavbar from './TopNavbar';

const Dashboard = () => (
  <div className="min-h-screen bg-gray-50">
    <TopNavbar />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900">Patient Dashboard</h1>
      <p className="text-gray-600 mt-2">Welcome to your dashboard</p>
    </div>
  </div>
);

export default Dashboard;
