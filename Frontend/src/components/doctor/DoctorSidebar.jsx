import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';

const DoctorSidebar = () => {
  const [userName, setUserName] = useState('Doctor');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserName(user.name || 'Doctor');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="bg-gradient-to-b from-cyan-600 via-teal-600 to-blue-600 text-white w-64 min-h-screen fixed left-0 top-0 p-6 shadow-lg flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
          🏥 Doctor Portal
        </h2>
        <nav className="space-y-2">
          <Link 
            to="/doctor/dashboard" 
            className="block px-4 py-3 rounded-lg hover:bg-white/20 transition-all duration-200"
          >
            Dashboard
          </Link>
          <Link 
            to="/doctor/appointments" 
            className="block px-4 py-3 rounded-lg hover:bg-white/20 transition-all duration-200"
          >
            Appointments
          </Link>
          <Link 
            to="/doctor/clinics" 
            className="block px-4 py-3 rounded-lg hover:bg-white/20 transition-all duration-200"
          >
            Clinics
          </Link>
          <Link 
            to="/doctor/vaccines" 
            className="block px-4 py-3 rounded-lg hover:bg-white/20 transition-all duration-200"
          >
            Vaccines
          </Link>
          <Link 
            to="/doctor/doses" 
            className="block px-4 py-3 rounded-lg hover:bg-white/20 transition-all duration-200"
          >
            Doses
          </Link>
          <Link 
            to="/doctor/profile" 
            className="block px-4 py-3 rounded-lg hover:bg-white/20 transition-all duration-200"
          >
            Profile
          </Link>
        </nav>
      </div>

      {/* User Profile and Logout */}
      <div className="border-t border-white/20 pt-6 space-y-3">
        <div className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-white/10">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium truncate">{userName}</span>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-red-500/80 hover:bg-red-600 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default DoctorSidebar;