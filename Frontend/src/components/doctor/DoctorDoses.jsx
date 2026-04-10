import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import DoctorSidebar from './DoctorSidebar';
import { usePatient } from '../../contexts/PatientContext';
import { immunizationLogAPI } from '../../../api';

const DoctorDoses = () => {
  const { selectedPatient } = usePatient();
  const [doses, setDoses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedPatient) {
      fetchPatientDoses();
    }
  }, [selectedPatient]);

  const fetchPatientDoses = async () => {
    try {
      setLoading(true);
      const response = await immunizationLogAPI.getPatientLogs(selectedPatient._id);
      setDoses(response.data || []);
    } catch (error) {
      toast.error('Failed to fetch doses');
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
        <h1 className="text-3xl font-bold text-gray-900">Vaccine Doses</h1>
        <p className="text-gray-600 mt-2">Patient: <span className="font-semibold">{selectedPatient.name}</span></p>

        <div className="mt-8 bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-blue-50 to-cyan-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Vaccine</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Dose #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Date Administered</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Clinic</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Notes</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    Loading doses...
                  </td>
                </tr>
              ) : doses.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No doses recorded. Go to Vaccines to assign doses to this patient.
                  </td>
                </tr>
              ) : (
                doses.map((dose) => (
                  <tr key={dose._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">{dose.vaccineId?.name || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{dose.doseNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{new Date(dose.dateAdministered).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{dose.clinic}</td>
                    <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{dose.notes || 'No notes'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {doses.length > 0 && (
          <div className="mt-6 bg-cyan-50 border border-cyan-200 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-cyan-900 mb-2">Summary</h3>
            <p className="text-cyan-700">Total vaccines/doses administered: <span className="font-bold">{doses.length}</span></p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDoses;
