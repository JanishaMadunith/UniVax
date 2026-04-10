import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Save, Shield, Users } from 'lucide-react';
import DoctorSidebar from './DoctorSidebar';
import { usePatient } from '../../contexts/PatientContext';
import { userAPI, vaccineAPI, immunizationLogAPI } from '../../../api';

const DoctorCreateLog = () => {
  const { selectedPatient, setSelectedPatient } = usePatient();
  const [patients, setPatients] = useState([]);
  const [vaccines, setVaccines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    userId: '',
    vaccineId: '',
    dateAdministered: '',
    doseNumber: 1,
    clinic: '',
    brand: '',
    batchNumber: '',
    notes: ''
  });

  // Load patients when component mounts
  useEffect(() => {
    fetchPatients();
    fetchVaccines();
  }, []);

  // Keep create-log patient aligned with doctor dashboard patient selection
  useEffect(() => {
    if (selectedPatient?._id) {
      setForm((prev) => ({ ...prev, userId: selectedPatient._id }));
    }
  }, [selectedPatient]);

  const fetchPatients = async () => {
    try {
      const res = await userAPI.getAllUsers();
      const users = Array.isArray(res.users) ? res.users : [];
      const patientUsers = users.filter((user) => user.role === 'Patient');
      setPatients(patientUsers);
    } catch (err) {
      toast.error('Failed to load patients');
      console.error(err);
    }
  };

  const fetchVaccines = async () => {
    try {
      const res = await vaccineAPI.getAllVaccines();
      setVaccines(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast.error('Failed to load vaccines');
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePatientSelect = (e) => {
    const patientId = e.target.value;
    setForm({ ...form, userId: patientId });

    // Keep dashboard context in sync if doctor changes patient here
    const patient = patients.find((p) => p._id === patientId) || null;
    setSelectedPatient(patient);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.userId || !form.vaccineId) {
      toast.error('Please select a patient');
      return;
    }

    try {
      setLoading(true);
      await immunizationLogAPI.createLog(form);
      toast.success('Immunization log created successfully!');

      // Clear form
      setForm({
        userId: selectedPatient?._id || '',
        vaccineId: '',
        dateAdministered: '',
        doseNumber: 1,
        clinic: '',
        brand: '',
        batchNumber: '',
        notes: ''
      });
    } catch (err) {
      toast.error('Failed to create log. Please check all fields.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50">
      <DoctorSidebar />

      <div className="ml-64 px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="text-teal-600" size={32} />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Log</h1>
            <p className="text-gray-600">Record vaccination after administration</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Patient Search Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Users size={18} /> Select Patient
              </label>
              <select
                name="userId"
                value={form.userId}
                onChange={handlePatientSelect}
                required
                className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="">-- Search and select patient --</option>
                {patients.map((patient) => (
                  <option key={patient._id} value={patient._id}>
                    {patient.name} ({patient.phone || patient.email || 'No Phone'})
                  </option>
                ))}
              </select>
              {selectedPatient?._id && (
                <p className="mt-2 text-sm text-cyan-700">
                  Synced with dashboard selection: {selectedPatient.name}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vaccine</label>
                <select
                  name="vaccineId"
                  value={form.vaccineId}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="">-- Select vaccine --</option>
                  {vaccines.map((vaccine) => (
                    <option key={vaccine._id} value={vaccine._id}>
                      {vaccine.name} ({vaccine._id})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Administered</label>
                <input
                  type="date"
                  name="dateAdministered"
                  value={form.dateAdministered}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dose Number</label>
                <input
                  type="number"
                  name="doseNumber"
                  value={form.doseNumber}
                  onChange={handleChange}
                  min="1"
                  required
                  className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                <input
                  type="text"
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Pfizer-BioNTech"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Batch Number</label>
                <input
                  type="text"
                  name="batchNumber"
                  value={form.batchNumber}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Clinic Name</label>
                <input
                  type="text"
                  name="clinic"
                  value={form.clinic}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows="4"
                className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Any side effects or observations..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 text-lg hover:shadow-lg transition-all"
            >
              <Save size={22} />
              {loading ? 'Saving...' : 'Save Log & Issue Digital Certificate'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DoctorCreateLog;