import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { toast } from 'react-toastify';
import DoctorSidebar from './DoctorSidebar';
import { usePatient } from '../../contexts/PatientContext';
import { userAPI } from '../../../api';

const DoctorDashboard = () => {
  const { selectedPatient, setSelectedPatient } = usePatient();
  const [patients, setPatients] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await userAPI.getAllUsers();
      const patientsList = response.users?.filter(user => user.role === 'Patient') || [];
      setPatients(patientsList);
    } catch (error) {
      toast.error('Failed to fetch patients');
      console.error(error);
    }
  };

  const handleSearch = (value) => {
    setSearchInput(value);
    if (value.length > 0) {
      const filtered = patients.filter(patient =>
        patient.name?.toLowerCase().includes(value.toLowerCase()) ||
        patient.email?.toLowerCase().includes(value.toLowerCase()) ||
        patient.phone?.includes(value)
      );
      setSearchResults(filtered);
      setShowDropdown(true);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  };

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setSearchInput('');
    setShowDropdown(false);
    toast.success(`Selected patient: ${patient.name}`);
  };

  const handleClearSelection = () => {
    setSelectedPatient(null);
    setSearchInput('');
    setShowDropdown(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50">
      <DoctorSidebar />
      <div className="ml-64 px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900">Doctor Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your doctor dashboard</p>

        {/* Patient Search Bar */}
        <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Search & Select Patient</h2>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by patient name, email, or phone..."
              value={searchInput}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
            
            {/* Dropdown Results */}
            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto">
                {searchResults.length > 0 ? (
                  <div className="divide-y">
                    {searchResults.map(patient => (
                      <button
                        key={patient._id}
                        onClick={() => handleSelectPatient(patient)}
                        className="w-full p-4 text-left hover:bg-cyan-50 transition-colors"
                      >
                        <div className="font-semibold text-gray-900">{patient.name}</div>
                        <div className="text-sm text-gray-600">{patient.email}</div>
                        <div className="text-sm text-gray-500">{patient.phone}</div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No patients found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Selected Patient Info */}
          {selectedPatient && (
            <div className="mt-4 p-4 bg-cyan-50 border border-cyan-200 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-cyan-900">Selected Patient:</p>
                <p className="text-cyan-700 font-semibold">{selectedPatient.name}</p>
                <p className="text-sm text-cyan-600">{selectedPatient.email} | {selectedPatient.phone}</p>
              </div>
              <button
                onClick={handleClearSelection}
                className="p-2 hover:bg-cyan-200 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-cyan-700" />
              </button>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-b-4 border-teal-500 hover:shadow-xl transition-all">
            <h3 className="text-lg font-semibold text-gray-900">Appointments</h3>
            <p className="text-4xl font-bold text-teal-600 mt-2">0</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border-b-4 border-cyan-500 hover:shadow-xl transition-all">
            <h3 className="text-lg font-semibold text-gray-900">Vaccines</h3>
            <p className="text-4xl font-bold text-cyan-600 mt-2">0</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border-b-4 border-blue-500 hover:shadow-xl transition-all">
            <h3 className="text-lg font-semibold text-gray-900">Clinics</h3>
            <p className="text-4xl font-bold text-blue-600 mt-2">0</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border-b-4 border-purple-500 hover:shadow-xl transition-all">
            <h3 className="text-lg font-semibold text-gray-900">Logs</h3>
            <p className="text-4xl font-bold text-purple-600 mt-2">12</p>
            <p className="text-xs text-purple-500 mt-1">Records this month</p>
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

export default DoctorDashboard;