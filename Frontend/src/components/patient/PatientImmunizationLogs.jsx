import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FileText, Calendar, Download, Eye, Shield } from 'lucide-react';

const PatientImmunizationLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/logs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLogs(res.data);
    } catch (err) {
      toast.error('Failed to load immunization logs');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (log) => setSelectedLog(log);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96 text-teal-600">
        Loading your vaccination records...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header - Matching your dashboard style */}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-teal-700">Immunization Logs</h1>
            <p className="text-gray-600">Complete record of all your vaccinations</p>
          </div>
          <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl shadow-sm">
            <Shield className="text-teal-500" size={24} />
            <div>
              <p className="text-sm font-medium">Protection Level</p>
              <p className="text-teal-600 font-semibold">92% Complete</p>
            </div>
          </div>
        </div>

        {/* Logs Grid - Card style like your dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {logs.length === 0 ? (
            <div className="col-span-3 text-center py-16 bg-white rounded-3xl shadow-sm">
              <FileText size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No immunization records yet</p>
            </div>
          ) : (
            logs.map((log) => (
              <div key={log._id} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-lg font-semibold text-gray-800">{log.vaccineId?.name || 'Vaccine'}</p>
                    <p className="text-sm text-teal-600">{log.brand} • Batch {log.batchNumber}</p>
                  </div>
                  <div className="text-right">
                    <span className="px-3 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded-2xl">
                      Dose {log.doseNumber}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                  <Calendar size={16} />
                  {new Date(log.dateAdministered).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>

                <p className="text-gray-600 text-sm mb-6 line-clamp-2">{log.clinic}</p>

                <button
                  onClick={() => handleView(log)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl transition-colors"
                >
                  <Eye size={18} />
                  View Full Record + Certificate
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl max-w-lg w-full mx-4 p-8">
            <h2 className="text-2xl font-bold mb-6">Vaccination Record</h2>
            {/* ... details here (same as before but styled nicely) */}
            <div className="space-y-6">
              <div className="flex justify-between">
                <span className="text-gray-500">Date</span>
                <span className="font-medium">{new Date(selectedLog.dateAdministered).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Brand</span>
                <span className="font-medium">{selectedLog.brand}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Batch Number</span>
                <span className="font-medium">{selectedLog.batchNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Clinic</span>
                <span className="font-medium">{selectedLog.clinic}</span>
              </div>
              <div>
                <span className="text-gray-500 block mb-1">Notes</span>
                <p className="text-gray-700">{selectedLog.notes || 'No additional notes'}</p>
              </div>
            </div>

            <div className="flex gap-3 mt-10">
              <button onClick={() => setSelectedLog(null)} className="flex-1 py-4 border border-gray-300 rounded-2xl font-medium">Close</button>
              <button className="flex-1 py-4 bg-teal-600 text-white rounded-2xl font-medium flex items-center justify-center gap-2">
                <Download size={20} /> Download Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientImmunizationLogs;