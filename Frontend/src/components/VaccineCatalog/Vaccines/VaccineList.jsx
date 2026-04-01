import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ChevronRight, AlertCircle, Loader } from 'lucide-react';
import { toast } from 'react-toastify';
import { vaccineAPI } from '../../../services/api';
import VaccineForm from './VaccineForm';
import VaccineDetail from './VaccineDetail';

const VaccineList = ({ onSelectVaccine }) => {
  const [vaccines, setVaccines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVaccine, setSelectedVaccine] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingVaccine, setEditingVaccine] = useState(null);
  const [filters, setFilters] = useState({ status: 'active' });

  // Fetch vaccines on component mount and when filters change
  useEffect(() => {
    fetchVaccines();
  }, [filters]);

  const fetchVaccines = async () => {
    try {
      setLoading(true);
      const response = await vaccineAPI.getAllVaccines(filters);
      setVaccines(response.data || response);
      toast.success('Vaccines loaded successfully');
    } catch (error) {
      toast.error('Failed to load vaccines: ' + error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vaccine?')) {
      try {
        await vaccineAPI.deleteVaccine(id, 'Deleted by user');
        setVaccines(vaccines.filter(v => v._id !== id));
        if (selectedVaccine?._id === id) {
          setSelectedVaccine(null);
        }
        toast.success('Vaccine deleted successfully');
      } catch (error) {
        toast.error('Failed to delete vaccine: ' + error.message);
      }
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingVaccine(null);
    fetchVaccines();
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

  if (selectedVaccine) {
    return (
      <VaccineDetail
        vaccine={selectedVaccine}
        onBack={() => setSelectedVaccine(null)}
        onEdit={(vaccine) => {
          setEditingVaccine(vaccine);
          setShowForm(true);
          setSelectedVaccine(null);
        }}
        onDelete={handleDelete}
      />
    );
  }

  if (showForm) {
    return (
      <VaccineForm
        vaccine={editingVaccine}
        onClose={handleCloseForm}
      />
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Vaccines</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
          >
            <Plus size={20} />
            Add Vaccine
          </button>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 flex-wrap">
          {['all', 'active', 'discontinued', 'pending', 'archived'].map((status) => (
            <button
              key={status}
              onClick={() =>
                setFilters(status === 'all' ? {} : { status })
              }
              className={`px-4 py-2 rounded-lg transition ${
                (status === 'all' ? Object.keys(filters).length === 0 : filters.status === status)
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
          <span>Loading vaccines...</span>
        </div>
      )}

      {/* Vaccines List */}
      {!loading && vaccines.length > 0 && (
        <div className="space-y-4">
          {vaccines.map((vaccine) => (
            <div
              key={vaccine._id}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div
                  className="flex-1"
                  onClick={() => setSelectedVaccine(vaccine)}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {vaccine.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {vaccine.genericName} • {vaccine.manufacturer}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(vaccine.status)}`}>
                          {vaccine.status}
                        </span>
                        <span className="text-xs text-gray-500">
                          CVX: {vaccine.cvxCode}
                        </span>
                        <span className="text-xs text-gray-500">
                          Total Doses: {vaccine.totalDoses}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="text-gray-400" />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingVaccine(vaccine);
                      setShowForm(true);
                    }}
                    className="text-blue-500 hover:text-blue-700 p-2 transition"
                    title="Edit vaccine"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(vaccine._id);
                    }}
                    className="text-red-500 hover:text-red-700 p-2 transition"
                    title="Delete vaccine"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && vaccines.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <AlertCircle className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-gray-600 mb-4">No vaccines found</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 transition"
          >
            <Plus size={18} />
            Create First Vaccine
          </button>
        </div>
      )}
    </div>
  );
};

export default VaccineList;
