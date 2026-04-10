import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import DoctorSidebar from './DoctorSidebar';
import { usePatient } from '../../contexts/PatientContext';

const DoctorAppointments = () => {
  const { selectedPatient } = usePatient();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedPatient) {
      fetchAppointments();
    }
  }, [selectedPatient]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      // Placeholder for API call - replace with actual appointment fetch
      // For now, showing empty state as appointments API path depends on your backend setup
      setAppointments([]);
    } catch (error) {
      toast.error('Failed to fetch appointments');
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
        <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
        <p className="text-gray-600 mt-2">Patient: <span className="font-semibold">{selectedPatient.name}</span></p>

        <div className="mt-8 bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-blue-50 to-cyan-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    Loading appointments...
                  </td>
                </tr>
              ) : appointments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No appointments scheduled for this patient
                  </td>
                </tr>
              ) : (
                appointments.map((appointment) => (
                  <tr key={appointment._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{appointment.patientName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{new Date(appointment.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{appointment.time}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        appointment.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                        appointment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-blue-600 cursor-pointer hover:underline">View</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointments;
