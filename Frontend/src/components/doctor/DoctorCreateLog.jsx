import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Save, Calendar, Shield } from 'lucide-react';
import DoctorSidebar from './DoctorSidebar';

const DoctorCreateLog = () => {
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

  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/logs', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Immunization log created successfully!');
      setForm({ userId: '', vaccineId: '', dateAdministered: '', doseNumber: 1, clinic: '', brand: '', batchNumber: '', notes: '' });
    } catch (err) {
      toast.error('Failed to create log. Please check all fields.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <DoctorSidebar/>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="text-teal-600" size={32} />
          <div>
            <h1 className="text-3xl font-bold text-teal-700">Create New Log</h1>
            <p className="text-gray-600">Record vaccination after administration</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm p-8 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Patient ID / PHN</label>
              <input
                type="text"
                name="userId"
                value={form.userId}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-teal-500"
                placeholder="Enter patient ID"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vaccine ID</label>
              <input
                type="text"
                name="vaccineId"
                value={form.vaccineId}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-teal-500"
                placeholder="Vaccine ID"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Administered</label>
              <input
                type="date"
                name="dateAdministered"
                value={form.dateAdministered}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dose Number</label>
              <input
                type="number"
                name="doseNumber"
                value={form.doseNumber}
                onChange={handleChange}
                min="1"
                required
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
              <input
                type="text"
                name="brand"
                value={form.brand}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-teal-500"
                placeholder="Pfizer-BioNTech"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Batch Number</label>
              <input
                type="text"
                name="batchNumber"
                value={form.batchNumber}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Clinic Name</label>
            <input
              type="text"
              name="clinic"
              value={form.clinic}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows="4"
              className="w-full border border-gray-200 rounded-3xl px-4 py-3 focus:outline-none focus:border-teal-500"
              placeholder="Any side effects or observations..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-4 rounded-3xl font-semibold flex items-center justify-center gap-2 text-lg transition-colors"
          >
            <Save size={22} />
            Save Log & Issue Digital Certificate
          </button>
        </form>
      </div>
    </div>
  );
};

export default DoctorCreateLog;