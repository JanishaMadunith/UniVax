import React, { useState } from 'react';
import { Pill, Syringe } from 'lucide-react';
import VaccineList from './Vaccines/VaccineList';
import DoseList from './Doses/DoseList';

const VaccineCatalog = () => {
  const [activeTab, setActiveTab] = useState('vaccines');
  const [selectedVaccineId, setSelectedVaccineId] = useState(null);
  const [selectedVaccineName, setSelectedVaccineName] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Vaccine Catalog</h1>
          <p className="text-gray-600">Manage vaccines and their dosing requirements</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => {
              setActiveTab('vaccines');
              setSelectedVaccineId(null);
            }}
            className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition ${
              activeTab === 'vaccines'
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            <Pill size={20} />
            Vaccines
          </button>
          <button
            onClick={() => setActiveTab('doses')}
            className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition ${
              activeTab === 'doses'
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
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
        <div className="bg-gray-50 rounded-lg p-6">
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
