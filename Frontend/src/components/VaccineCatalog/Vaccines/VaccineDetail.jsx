import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit2, Trash2, History, AlertCircle } from 'lucide-react';
import { vaccineAPI } from '../../services/api';
import DoseList from '../Doses/DoseList';

const VaccineDetail = ({ vaccine, onBack, onEdit, onDelete }) => {
  const [vaccineHistory, setVaccineHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showDoses, setShowDoses] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const fetchHistory = async () => {
    try {
      setLoadingHistory(true);
      const response = await vaccineAPI.getVaccineHistory(vaccine._id);
      setVaccineHistory(response.data || response);
      setShowHistory(true);
    } catch (error) {
      console.error('Failed to load vaccine history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      discontinued: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
      archived: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (showDoses) {
    return (
      <DoseList
        vaccineId={vaccine._id}
        vaccineName={vaccine.name}
        onBack={() => setShowDoses(false)}
      />
    );
  }

  if (showHistory) {
    return (
      <div className="w-full">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <button
            onClick={() => setShowHistory(false)}
            className="text-gray-600 hover:text-gray-800 transition mb-4"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-3xl font-bold text-gray-800">
            Vaccine History - {vaccine.name}
          </h1>
        </div>

        {/* History Timeline */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-4">
            {vaccineHistory.length > 0 ? (
              vaccineHistory.map((version, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-800">
                        Version {version.version}
                      </p>
                      <p className="text-sm text-gray-600">
                        {version.updateReason}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(version.validFrom).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(version.status)}`}>
                      {version.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No history available</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-800 transition"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(vaccine)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
            >
              <Edit2 size={18} />
              Edit
            </button>
            <button
              onClick={() => onDelete(vaccine._id)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
            >
              <Trash2 size={18} />
              Delete
            </button>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-800">{vaccine.name}</h1>
        <p className="text-gray-600 mt-1">{vaccine.genericName}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="md:col-span-2 space-y-6">
          {/* Basic Information Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">
              Basic Information
            </h2>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Manufacturer</p>
                  <p className="font-semibold text-gray-800">{vaccine.manufacturer}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">CVX Code</p>
                  <p className="font-semibold text-gray-800">{vaccine.cvxCode}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Doses</p>
                  <p className="font-semibold text-gray-800">{vaccine.totalDoses}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(vaccine.status)}`}>
                    {vaccine.status}
                  </span>
                </div>
              </div>

              {vaccine.description && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Description</p>
                  <p className="text-gray-800">{vaccine.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Presentation & Storage Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">
              Presentation & Storage
            </h2>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Presentation</p>
                  <p className="font-semibold text-gray-800 capitalize">
                    {vaccine.presentation}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Volume</p>
                  <p className="font-semibold text-gray-800">
                    {vaccine.volume.value} {vaccine.volume.unit}
                  </p>
                </div>
              </div>

              {vaccine.storageRequirements?.requiresRefrigeration && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-gray-600">Storage Temperature</p>
                  <p className="font-semibold text-gray-800">
                    {vaccine.storageRequirements.minTemp}°C to {vaccine.storageRequirements.maxTemp}°C
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    ⚠️ Requires Refrigeration
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Doses Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4 pb-2 border-b">
              <h2 className="text-xl font-semibold text-gray-800">
                Dose Requirements
              </h2>
              <button
                onClick={() => setShowDoses(true)}
                className="text-blue-500 hover:text-blue-700 font-medium text-sm transition"
              >
                View All →
              </button>
            </div>
            <p className="text-gray-600 text-sm">
              Click "View All" to see and manage dose requirements for this vaccine.
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Version & Dates Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
              Version Information
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Current Version</p>
                <p className="font-semibold text-gray-800 text-lg">{vaccine.version}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Valid From</p>
                <p className="font-semibold text-gray-800">
                  {new Date(vaccine.validFrom).toLocaleDateString()}
                </p>
              </div>
              {vaccine.validUntil && (
                <div>
                  <p className="text-sm text-gray-600">Valid Until</p>
                  <p className="font-semibold text-gray-800">
                    {new Date(vaccine.validUntil).toLocaleDateString()}
                  </p>
                </div>
              )}
              <button
                onClick={fetchHistory}
                disabled={loadingHistory}
                className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2"
              >
                <History size={18} />
                {loadingHistory ? 'Loading...' : 'View History'}
              </button>
            </div>
          </div>

          {/* Approved Regions Card */}
          {vaccine.approvedRegions?.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
                Approved Regions
              </h3>
              <div className="space-y-2">
                {vaccine.approvedRegions.map((region, index) => (
                  <div key={index} className="p-2 bg-gray-50 rounded">
                    <p className="font-semibold text-gray-800 text-sm">{region.country}</p>
                    <p className="text-xs text-gray-600">
                      by {region.regulatoryBody}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contraindications Card */}
          {vaccine.contraindications?.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
                Contraindications
              </h3>
              <div className="space-y-2">
                {vaccine.contraindications.map((contra, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded text-sm ${
                      contra.severity === 'absolute'
                        ? 'bg-red-50 border border-red-200'
                        : 'bg-yellow-50 border border-yellow-200'
                    }`}
                  >
                    <p className="font-semibold text-gray-800">{contra.condition}</p>
                    <p className="text-xs text-gray-600 mt-1">{contra.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VaccineDetail;
