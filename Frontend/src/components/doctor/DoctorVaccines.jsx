import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import DoctorSidebar from './DoctorSidebar';
import { usePatient } from '../../contexts/PatientContext';
import { vaccineAPI, doseAPI, immunizationLogAPI } from '../../../api';

const DoctorVaccines = () => {
  const { selectedPatient, selectedClinic, setSelectedClinic } = usePatient();
  const [vaccines, setVaccines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [vaccineAssignments, setVaccineAssignments] = useState([]);
  const [selectedVaccineId, setSelectedVaccineId] = useState('');
  const [doses, setDoses] = useState([]);
  const [selectedDoseId, setSelectedDoseId] = useState('');
  const [dateAdministered, setDateAdministered] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [clinics, setClinics] = useState(['Central Clinic', 'Community Health Center', 'Mobile Clinic']);

  useEffect(() => {
    fetchVaccines();
  }, []);

  const fetchVaccines = async () => {
    try {
      setLoading(true);
      const response = await vaccineAPI.getAllVaccines();
      setVaccines(response.data || []);
    } catch (error) {
      toast.error('Failed to fetch vaccines');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVaccineChange = async (vaccineId) => {
    setSelectedVaccineId(vaccineId);
    setSelectedDoseId('');

    if (vaccineId) {
      try {
        const dosesRes = await doseAPI.getVaccineDoses(vaccineId);
        setDoses(dosesRes.data || []);
      } catch (error) {
        console.error('Error fetching doses:', error);
        setDoses([]);
      }
    }
  };

  const handleAddVaccine = () => {
    if (!selectedPatient) {
      toast.error('Please select a patient from the dashboard first');
      return;
    }

    if (!selectedVaccineId || !selectedDoseId || !selectedClinic) {
      toast.error('Please select vaccine, dose, and clinic');
      return;
    }

    const vaccine = vaccines.find(v => v._id === selectedVaccineId);
    const dose = doses.find(d => d._id === selectedDoseId);

    const newAssignment = {
      tempId: Date.now(),
      vaccineId: selectedVaccineId,
      vaccineName: vaccine?.name,
      doseId: selectedDoseId,
      doseNumber: dose?.doseNumber,
      clinic: selectedClinic,
      notes,
      dateAdministered,
    };

    setVaccineAssignments([...vaccineAssignments, newAssignment]);
    setSelectedVaccineId('');
    setSelectedDoseId('');
    setNotes('');
    toast.success('Vaccine added to assignment list');
  };

  const handleRemoveAssignment = (tempId) => {
    setVaccineAssignments(vaccineAssignments.filter(a => a.tempId !== tempId));
  };

  const handleSubmitAssignments = async () => {
    if (!selectedPatient || vaccineAssignments.length === 0) {
      toast.error('Please select patient and add vaccines');
      return;
    }

    try {
      setLoading(true);
      let successCount = 0;

      for (const assignment of vaccineAssignments) {
        try {
          await immunizationLogAPI.createLog({
            userId: selectedPatient._id,
            vaccineId: assignment.vaccineId,
            doseNumber: assignment.doseNumber,
            dateAdministered: assignment.dateAdministered,
            clinic: assignment.clinic,
            notes: assignment.notes,
          });
          successCount++;
        } catch (error) {
          console.error(`Failed to assign ${assignment.vaccineName}:`, error);
        }
      }

      toast.success(`Successfully assigned ${successCount} vaccine(s)`);
      setVaccineAssignments([]);
    } catch (error) {
      toast.error('Failed to assign vaccines');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedPatient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50">
        <DoctorSidebar />
        <div className="ml-64 px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Patient Selected</h2>
            <p className="text-gray-600 mb-6">Please go to the Doctor Dashboard and search for a patient first</p>
            <a href="/doctor/dashboard" className="inline-block bg-cyan-600 text-white px-6 py-2 rounded-lg hover:bg-cyan-700 transition-colors">
              Go to Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50">
      <DoctorSidebar />
      <div className="ml-64 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Assign Vaccines</h1>
          <p className="text-gray-600 mb-6">Patient: <span className="font-semibold">{selectedPatient.name}</span></p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Vaccine Assignment Form */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Add Vaccine</h2>

              <div className="space-y-4">
                {/* Vaccine Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Select Vaccine</label>
                  <select
                    value={selectedVaccineId}
                    onChange={(e) => handleVaccineChange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
                  >
                    <option value="">Choose a vaccine...</option>
                    {vaccines.map(vaccine => (
                      <option key={vaccine._id} value={vaccine._id}>
                        {vaccine.name} ({vaccine.genericName})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dose Selection */}
                {selectedVaccineId && doses.length > 0 && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Select Dose</label>
                    <select
                      value={selectedDoseId}
                      onChange={(e) => setSelectedDoseId(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
                    >
                      <option value="">Choose a dose...</option>
                      {doses.map(dose => (
                        <option key={dose._id} value={dose._id}>
                          Dose {dose.doseNumber} - {dose.ageGroup}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Clinic Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Clinic</label>
                  <select
                    value={selectedClinic || ''}
                    onChange={(e) => setSelectedClinic(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
                  >
                    <option value="">Select clinic...</option>
                    {clinics.map((clinic, idx) => (
                      <option key={idx} value={clinic}>{clinic}</option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Date Administered</label>
                  <input
                    type="date"
                    value={dateAdministered}
                    onChange={(e) => setDateAdministered(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Notes (Optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any observations..."
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
                  />
                </div>

                <button
                  onClick={handleAddVaccine}
                  className="w-full bg-cyan-600 text-white py-3 px-4 rounded-lg hover:bg-cyan-700 transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Vaccine to List
                </button>
              </div>
            </div>

            {/* Assignments List */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Vaccines ({vaccineAssignments.length})</h2>

              {vaccineAssignments.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  Add vaccines →
                </div>
              ) : (
                <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                  {vaccineAssignments.map(assignment => (
                    <div key={assignment.tempId} className="flex items-start justify-between bg-cyan-50 p-3 rounded-lg border border-cyan-200">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{assignment.vaccineName}</p>
                        <p className="text-xs text-gray-600">Dose {assignment.doseNumber}</p>
                        <p className="text-xs text-gray-500">{assignment.clinic}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveAssignment(assignment.tempId)}
                        className="text-red-600 hover:text-red-700 ml-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {vaccineAssignments.length > 0 && (
                <button
                  onClick={handleSubmitAssignments}
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:bg-gray-400 flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {loading ? 'Assigning...' : 'Confirm & Assign'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorVaccines;
