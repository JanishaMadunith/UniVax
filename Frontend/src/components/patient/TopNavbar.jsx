import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  Calendar, 
  Info,
  Syringe,
  LogOut,
  User,
  FileText   // ← New icon for Logs
} from 'lucide-react';

const TopNavbar = () => {
  const location = useLocation();
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserName(user.name || 'User');
    }
  }, []);

  const navItems = [
    { path: '/patient/dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { path: '/patient/clinics', name: 'Clinics', icon: Building2 },
    { path: '/patient/appointments', name: 'Appointments', icon: Calendar },
    { path: '/patient/immunization-logs', name: 'Logs', icon: FileText },        // ← YOUR LINK
    { path: '/patient/about', name: 'About Us', icon: Info },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Syringe className="w-8 h-8 text-green-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              UniVax
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${isActive(item.path)
                      ? 'bg-gradient-to-r from-blue-50 to-green-50 text-green-600 border-b-2 border-green-500'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-green-600'
                    }
                  `}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <div className="relative group">
              <button className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:inline-block">
                  {userName}
                </span>
              </button>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:inline-block">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;