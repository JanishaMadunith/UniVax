import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ChevronRight, AlertCircle, Loader, ArrowLeft, Lock } from 'lucide-react';
import { toast } from 'react-toastify';
import { doseAPI } from '../../../services/api';
import DoseForm from './DoseForm';
import DoseDetail from './DoseDetail';

const DoseList = ({ vaccineId, vaccineName, onBack }) => {
  const [doses, setDoses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDose, setSelectedDose] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingDose, setEditingDose] = useState(null);
  const [filters, setFilters] = useState({ status: 'active' });
  const [userRole, setUserRole] = useState(null);

  // Get user role on component mount
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        setUserRole(userData.role);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  useEffect(() => {
    fetchDoses();
  }, [vaccineId, filters]);

  const fetchDoses = async () => {
    try {
      setLoading(true);
      const response = await doseAPI.getVaccineDoses(vaccineId);
      // Filter locally if filters are applied
      let filteredDoses = response.data || response;
      if (filters.status && filters.status !== 'all') {
        filteredDoses = filteredDoses.filter(d => d.status === filters.status);
      }
      setDoses(filteredDoses);
      toast.success('Doses loaded successfully');
    } catch (error) {
      toast.error('Failed to load doses: ' + error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this dose?')) {
      try {
        await doseAPI.deleteDose(id);
        setDoses(doses.filter(d => d._id !== id));
        if (selectedDose?._id === id) {
          setSelectedDose(null);
        }
        toast.success('Dose deleted successfully');
      } catch (error) {
        toast.error('Failed to delete dose: ' + error.message);
      }
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingDose(null);
    fetchDoses();
  };

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

  if (selectedDose) {
    return (
      <DoseDetail
        dose={selectedDose}
        vaccineId={vaccineId}
        vaccineName={vaccineName}
        onBack={() => setSelectedDose(null)}
        onEdit={(dose) => {
          setEditingDose(dose);
          setShowForm(true);
          setSelectedDose(null);
        }}
        onDelete={handleDelete}
      />
    );
  }

  if (showForm) {
    return (
      <DoseForm
        dose={editingDose}
        vaccineId={vaccineId}
        vaccineName={vaccineName}
        onClose={handleCloseForm}
      />
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-800 transition"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800">Dose Requirements</h1>
            <p className="text-gray-600">{vaccineName}</p>
          </div>
          {(userRole === 'Doctor' || userRole === 'Admin') && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
            >
              <Plus size={20} />
              Add Dose
            </button>
          )}
          {userRole === 'Patient' && (
            <div className="text-gray-500 text-sm flex items-center gap-2">
              <Lock size={16} />
              View Only (Patient)
            </div>
          )}
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 flex-wrap">
          {['all', 'active', 'superseded', 'pending'].map((status) => (
            <button
              key={status}
              onClick={() =>
                setFilters(status === 'all' ? { status: 'all' } : { status })
              }
              className={`px-4 py-2 rounded-lg transition ${
                filters.status === status
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center gap-2 p-8">
          <Loader className="animate-spin" />
          <span>Loading doses...</span>
        </div>
      )}

      {/* Doses List */}
      {!loading && doses.length > 0 && (
        <div className="space-y-4">
          {doses.map((dose) => (
            <div
              key={dose._id}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div
                  className="flex-1"
                  onClick={() => setSelectedDose(dose)}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {dose.doseName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Dose #{dose.doseNumber}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(dose.status)}`}>
                          {dose.status}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(dose.priority)}`}>
                          {dose.priority}
                        </span>
                        <span className="text-xs text-gray-500">
                          Min Age: {dose.minAge.value} {dose.minAge.unit}
                        </span>
                        {dose.maxAge?.value && (
                          <span className="text-xs text-gray-500">
                            Max Age: {dose.maxAge.value} {dose.maxAge.unit}
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="text-gray-400" />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 ml-4">
                  {/* Edit Button - Doctor/Admin only */}
                  {(userRole === 'Doctor' || userRole === 'Admin') ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingDose(dose);
                        setShowForm(true);
                      }}
                      className="text-blue-500 hover:text-blue-700 p-2 transition"
                      title="Edit dose"
                    >
                      <Edit2 size={18} />
                    </button>
                  ) : (
                    <div className="text-gray-300 p-2 cursor-not-allowed" title="Only Doctor/Admin can edit">
                      <Edit2 size={18} />
                    </div>
                  )}

                  {/* Delete Button - Doctor/Admin only */}
                  {(userRole === 'Doctor' || userRole === 'Admin') ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(dose._id);
                      }}
                      className="text-red-500 hover:text-red-700 p-2 transition"
                      title="Delete dose"
                    >
                      <Trash2 size={18} />
                    </button>
                  ) : (
                    <div className="text-gray-300 p-2 cursor-not-allowed" title="Only Doctor/Admin can delete">
                      <Lock size={18} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && doses.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <AlertCircle className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-gray-600 mb-4">No doses found for this vaccine</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 transition"
          >
            <Plus size={18} />
            Create First Dose
          </button>
        </div>
      )}
    </div>
  );
};

export default DoseList;
