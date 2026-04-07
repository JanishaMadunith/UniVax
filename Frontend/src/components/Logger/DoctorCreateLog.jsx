import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Save } from 'lucide-react';

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
      toast.success('Log created successfully!');
      setForm({ userId: '', vaccineId: '', dateAdministered: '', doseNumber: 1, clinic: '', brand: '', batchNumber: '', notes: '' });
    } catch (err) {
      toast.error('Failed to create log');
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-teal-700 mb-2">Create Immunization Log</h1>
      <p className="text-gray-600 mb-8">Record a new vaccination after administration</p>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border p-8 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Patient ID / PHN</label>
            <input type="text" name="userId" value={form.userId} onChange={handleChange} required className="w-full border rounded-2xl px-4 py-3" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Vaccine ID</label>
            <input type="text" name="vaccineId" value={form.vaccineId} onChange={handleChange} required className="w-full border rounded-2xl px-4 py-3" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Date Administered</label>
            <input type="date" name="dateAdministered" value={form.dateAdministered} onChange={handleChange} required className="w-full border rounded-2xl px-4 py-3" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Dose Number</label>
            <input type="number" name="doseNumber" value={form.doseNumber} onChange={handleChange} min="1" required className="w-full border rounded-2xl px-4 py-3" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Brand</label>
            <input type="text" name="brand" value={form.brand} onChange={handleChange} required className="w-full border rounded-2xl px-4 py-3" placeholder="e.g. Pfizer-BioNTech" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Batch Number</label>
            <input type="text" name="batchNumber" value={form.batchNumber} onChange={handleChange} required className="w-full border rounded-2xl px-4 py-3" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Clinic</label>
          <input type="text" name="clinic" value={form.clinic} onChange={handleChange} required className="w-full border rounded-2xl px-4 py-3" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea name="notes" value={form.notes} onChange={handleChange} rows="3" className="w-full border rounded-3xl px-4 py-3" />
        </div>

        <button
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-700 text-white py-4 rounded-3xl font-semibold flex items-center justify-center gap-2"
        >
          <Save size={20} /> Save & Issue Certificate
        </button>
      </form>
    </div>
  );
};

export default DoctorCreateLog;