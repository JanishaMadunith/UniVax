import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FileText, Calendar, Download, Eye } from 'lucide-react';

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
      toast.error('Failed to load logs');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (log) => {
    setSelectedLog(log);
  };

  if (loading) return <div className="text-center py-10">Loading your immunization history...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-teal-700 mb-2">Immunization History</h1>
      <p className="text-gray-600 mb-8">All your vaccination records with brand & batch details</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            {logs.length === 0 ? (
              <p className="text-center py-12 text-gray-500">No logs found yet</p>
            ) : (
              logs.map((log) => (
                <div key={log._id} className="flex items-center justify-between p-5 border-b last:border-none hover:bg-gray-50">
                  <div>
                    <div className="font-semibold">{log.vaccineId?.name || 'Vaccine'}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(log.dateAdministered).toLocaleDateString()} • Dose {log.doseNumber}
                    </div>
                    <div className="text-xs text-teal-600 mt-1">{log.clinic}</div>
                  </div>
                  <button
                    onClick={() => handleView(log)}
                    className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700"
                  >
                    <Eye size={18} /> View
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Detail Sidebar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit sticky top-6">
          {selectedLog ? (
            <>
              <h2 className="text-xl font-semibold mb-4">Log Details</h2>
              <div className="space-y-4 text-sm">
                <div>
                  <span className="text-gray-500">Date:</span>
                  <p className="font-medium">{new Date(selectedLog.dateAdministered).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-gray-500">Vaccine:</span>
                  <p className="font-medium">{selectedLog.vaccineId?.name}</p>
                </div>
                <div>
                  <span className="text-gray-500">Brand:</span>
                  <p className="font-medium">{selectedLog.brand}</p>
                </div>
                <div>
                  <span className="text-gray-500">Batch No:</span>
                  <p className="font-medium">{selectedLog.batchNumber}</p>
                </div>
                <div>
                  <span className="text-gray-500">Clinic:</span>
                  <p className="font-medium">{selectedLog.clinic}</p>
                </div>
                <div>
                  <span className="text-gray-500">Notes:</span>
                  <p className="text-gray-600">{selectedLog.notes || 'No notes'}</p>
                </div>
              </div>

              {selectedLog.digitalCertificate && (
                <button className="mt-8 w-full flex items-center justify-center gap-2 bg-teal-600 text-white py-3 rounded-2xl hover:bg-teal-700">
                  <Download size={20} /> Download Certificate
                </button>
              )}
            </>
          ) : (
            <div className="text-center text-gray-400 py-12">
              <FileText size={48} className="mx-auto mb-3" />
              Select a log to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientImmunizationLogs;