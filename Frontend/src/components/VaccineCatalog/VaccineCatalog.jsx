import React, { useState } from 'react';
import { Pill, Syringe } from 'lucide-react';
import VaccineList from './Vaccines/VaccineList';
import DoseList from './Doses/DoseList';

const VaccineCatalog = () => {
  const [activeTab, setActiveTab] = useState('vaccines');
  const [selectedVaccineId, setSelectedVaccineId] = useState(null);
  const [selectedVaccineName, setSelectedVaccineName] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
            Vaccine Catalog
          </h1>
          <p className="text-gray-600">Manage vaccines and their dosing requirements</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-6 flex-wrap">
          <button
            onClick={() => {
              setActiveTab('vaccines');
              setSelectedVaccineId(null);
            }}
            className={`px-6 py-3 rounded-2xl font-medium flex items-center gap-2 transition shadow-md ${
              activeTab === 'vaccines'
                ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-blue-200'
            }`}
          >
            <Pill size={20} />
            Vaccines
          </button>
          <button
            onClick={() => setActiveTab('doses')}
            className={`px-6 py-3 rounded-2xl font-medium flex items-center gap-2 transition shadow-md ${
              activeTab === 'doses'
                ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-blue-200 disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
            disabled={!selectedVaccineId}
            title={!selectedVaccineId ? 'Select a vaccine first' : ''}
          >
            <Syringe size={20} />
            Dose Requirements
            {selectedVaccineId && selectedVaccineName && (
              <span className="ml-2 text-sm">({selectedVaccineName})</span>
            )}
          </button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100">
          {activeTab === 'vaccines' && (
            <div>
              <VaccineList
                onSelectVaccine={(vaccineId, vaccineName) => {
                  setSelectedVaccineId(vaccineId);
                  setSelectedVaccineName(vaccineName);
                  setActiveTab('doses');
                }}
              />
            </div>
          )}

          {activeTab === 'doses' && selectedVaccineId && (
            <div>
              <DoseList
                vaccineId={selectedVaccineId}
                vaccineName={selectedVaccineName}
                onBack={() => {
                  setActiveTab('vaccines');
                  setSelectedVaccineId(null);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VaccineCatalog;
