import React, { useState } from 'react';
import { Trash2, Search, AlertTriangle, Loader2, ChevronLeft } from 'lucide-react';
import { getReports, deleteReport } from '../services/api';
import { Report } from '../types/Report';
import toast from 'react-hot-toast';

const DeleteReport: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Report[]>([]);
  const [reportToDelete, setReportToDelete] = useState<Report | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      toast.error('Please enter a search term.');
      return;
    }
    setIsSearching(true);
    setSearchResults([]);
    try {
      const results = await getReports(searchTerm);
      if (results.length === 0) {
        toast.error("No reports found.");
      }
      setSearchResults(results);
    } catch (error) {
      toast.error("Failed to search for reports.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleDelete = async () => {
    if (!reportToDelete) return;

    setIsDeleting(true);
    try {
      await deleteReport(reportToDelete.id);
      toast.success("Report deleted successfully!");
      setReportToDelete(null); // Close modal
      // Refresh the search results after deletion
      handleSearch(new Event('submit') as unknown as React.FormEvent);
    } catch (error) {
      toast.error("Failed to delete report.");
      console.error("Delete Error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Trash2 className="h-6 w-6 text-red-600" />
          <h2 className="text-2xl font-bold text-gray-900">Delete a Report</h2>
        </div>

        <form onSubmit={handleSearch} className="flex gap-4 mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            placeholder="Search by Name, Phone, or Serial #"
          />
          <button
            type="submit"
            disabled={isSearching}
            className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center justify-center w-12"
          >
            {isSearching ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
          </button>
        </form>

        {searchResults.length > 0 && (
          <div className="space-y-3 border-t pt-4">
             <h3 className="font-semibold mb-2">Search Results:</h3>
            {searchResults.map(report => (
              <div key={report.id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-semibold">{report.customer_name}</p>
                  <p className="text-sm text-gray-500">{report.serial_number}</p>
                </div>
                <button
                  onClick={() => setReportToDelete(report)}
                  className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
             <button onClick={clearSearch} className="text-sm text-blue-600 hover:underline mt-4">
                Clear Search Results
            </button>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {reportToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
            <p>Are you sure you want to delete the report for "{reportToDelete.customer_name}"?</p>
            <div className="mt-6 flex justify-end gap-4">
              <button onClick={() => setReportToDelete(null)} disabled={isDeleting} className="py-2 px-4 bg-gray-200 rounded-lg">
                Cancel
              </button>
              <button onClick={handleDelete} disabled={isDeleting} className="py-2 px-4 bg-red-600 text-white rounded-lg">
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
