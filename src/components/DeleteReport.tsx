import React, { useState, useEffect, useCallback } from 'react';
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { getReports, deleteReport } from '../services/api';
import { Report } from '../types/Report';
import toast from 'react-hot-toast';

const DeleteReport: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reportToDelete, setReportToDelete] = useState<Report | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getReports();
      setReports(data);
    } catch (error) {
      console.error("Failed to fetch reports", error);
      toast.error("Could not load reports.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleDelete = async () => {
    if (!reportToDelete) return;

    setIsDeleting(true);
    try {
      await deleteReport(reportToDelete.id);
      toast.success("Report deleted successfully!");
      setReportToDelete(null); // Close modal
      fetchReports(); // Refresh the list of reports
    } catch (error) {
      toast.error("Failed to delete report.");
      console.error("Delete Error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Trash2 className="h-6 w-6 text-red-600" />
          <h2 className="text-2xl font-bold text-gray-900">Delete a Report</h2>
        </div>
        
        <div className="space-y-3">
          {isLoading ? (
            <p className="text-center text-gray-500">Loading reports...</p>
          ) : reports.length > 0 ? (
            reports.map(report => (
              <div key={report.id} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div>
                  <p className="font-semibold text-gray-800">{report.customer_name}</p>
                  <p className="text-sm text-gray-500">ID: {report.id}</p>
                  <p className="text-sm text-gray-500">S/N: {report.serial_number}</p>
                </div>
                <button
                  onClick={() => setReportToDelete(report)}
                  className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors"
                  aria-label={`Delete report for ${report.customer_name}`}
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No reports to delete.</p>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {reportToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 m-4 shadow-xl max-w-sm w-full">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-8 w-8 text-red-500 mr-3" />
              <h3 className="text-xl font-bold">Confirm Deletion</h3>
            </div>
            <p className="text-gray-700">
              Are you sure you want to permanently delete the report for "{reportToDelete.customer_name}" (S/N: {reportToDelete.serial_number})? This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-4">
              <button 
                onClick={() => setReportToDelete(null)} 
                disabled={isDeleting}
                className="py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete} 
                disabled={isDeleting}
                className="py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center justify-center"
              >
                {isDeleting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteReport;
