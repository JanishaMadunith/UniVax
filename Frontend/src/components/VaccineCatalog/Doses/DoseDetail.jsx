import React from 'react';
import { ArrowLeft, Edit2, Trash2 } from 'lucide-react';

const DoseDetail = ({ dose, vaccineId, vaccineName, onBack, onEdit, onDelete }) => {
  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      superseded: 'bg-orange-100 text-orange-800',
      pending: 'bg-yellow-100 text-yellow-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      routine: 'bg-blue-100 text-blue-800',
      catchup: 'bg-orange-100 text-orange-800',
      special: 'bg-purple-100 text-purple-800',
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

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
              onClick={() => onEdit(dose)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
            >
              <Edit2 size={18} />
              Edit
            </button>
            <button
              onClick={() => onDelete(dose._id)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
            >
              <Trash2 size={18} />
              Delete
            </button>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-800">{dose.doseName}</h1>
        <p className="text-gray-600 mt-1">{vaccineName}</p>
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
                  <p className="text-sm text-gray-600">Dose Number</p>
                  <p className="font-semibold text-gray-800 text-lg">
                    Dose #{dose.doseNumber}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Priority</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(dose.priority)}`}>
                    {dose.priority}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(dose.status)}`}>
                    {dose.status}
                  </span>
                </div>
              </div>

              {dose.notes && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Notes</p>
                  <p className="text-gray-800">{dose.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Age Requirements Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">
              Age Requirements
            </h2>
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-600 mb-1">Minimum Age</p>
                  <p className="font-semibold text-gray-800 text-lg">
                    {dose.minAge.value} {dose.minAge.unit}
                  </p>
                </div>
                {dose.maxAge?.value && (
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-sm text-gray-600 mb-1">Maximum Age</p>
                    <p className="font-semibold text-gray-800 text-lg">
                      {dose.maxAge.value} {dose.maxAge.unit}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Interval Requirements Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">
              Interval from Previous Dose
            </h2>
            <div className="space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Min Days</p>
                  <p className="font-semibold text-gray-800">
                    {dose.intervalFromPrevious.minDays || 0}
                  </p>
                </div>
                {dose.intervalFromPrevious.maxDays && (
                  <div>
                    <p className="text-sm text-gray-600">Max Days</p>
                    <p className="font-semibold text-gray-800">
                      {dose.intervalFromPrevious.maxDays}
                    </p>
                  </div>
                )}
                {dose.intervalFromPrevious.exactDays && (
                  <div>
                    <p className="text-sm text-gray-600">Exact Days</p>
                    <p className="font-semibold text-gray-800">
                      {dose.intervalFromPrevious.exactDays}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">Allowable Delay</p>
                  <p className="font-semibold text-gray-800">
                    {dose.allowableDelay} days
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Guidelines Card */}
          {dose.guidelines && dose.guidelines.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">
                Guidelines
              </h2>
              <div className="space-y-3">
                {dose.guidelines.map((guideline, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="font-semibold text-gray-800">{guideline.authority}</p>
                    {guideline.reference && (
                      <p className="text-sm text-gray-600 mt-1">{guideline.reference}</p>
                    )}
                    {guideline.url && (
                      <a
                        href={guideline.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-500 hover:underline block mt-1"
                      >
                        {guideline.url}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Version Information Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
              Version Information
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Current Version</p>
                <p className="font-semibold text-gray-800 text-lg">{dose.version}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Valid From</p>
                <p className="font-semibold text-gray-800">
                  {new Date(dose.validFrom).toLocaleDateString()}
                </p>
              </div>
              {dose.validUntil && (
                <div>
                  <p className="text-sm text-gray-600">Valid Until</p>
                  <p className="font-semibold text-gray-800">
                    {new Date(dose.validUntil).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Summary Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
              Quick Summary
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Vaccine:</span>
                <span className="font-semibold text-gray-800">{vaccineName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Priority:</span>
                <span className="font-semibold text-gray-800 capitalize">
                  {dose.priority}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Age Range:</span>
                <span className="font-semibold text-gray-800">
                  {dose.minAge.value}
                  {dose.maxAge?.value && ` - ${dose.maxAge.value}`} {dose.minAge.unit}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Min Interval:</span>
                <span className="font-semibold text-gray-800">
                  {dose.intervalFromPrevious.minDays} days
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoseDetail;
