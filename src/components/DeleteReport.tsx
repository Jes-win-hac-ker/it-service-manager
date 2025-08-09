import React, { useState, useEffect } from 'react';
import { Trash2, Search, AlertTriangle, User, Phone, Hash } from 'lucide-react';
import { getReports, deleteReport } from '../services/api';
import { Report } from '../types/Report';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const DeleteReport: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Report[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<Report | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm.trim()) {
        performSearch();
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const performSearch = async () => {
    setIsSearching(true);
    try {
      const results = await apiService.getAllReports(searchTerm);
      setSearchResults(results);
    } catch (error) {
      toast.error('Search failed');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const initiateDelete = (report: Report) => {
    setReportToDelete(report);
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    if (!reportToDelete) return;

    setIsDeleting(true);
    try {
      await apiService.deleteReport(reportToDelete.id!);
      toast.success('Report deleted successfully!');
      setSearchResults(prev => prev.filter(r => r.id !== reportToDelete.id));
      setShowConfirmDialog(false);
      setReportToDelete(null);
    } catch (error) {
      toast.error('Failed to delete report');
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setShowConfirmDialog(false);
    setReportToDelete(null);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch {
      return dateString;
    }
  };

  const getStatusBadge = (report: Report) => {
    if (report.date_returned) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Returned</span>;
    } else if (report.date_diagnosed) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Diagnosed</span>;
    } else {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Received</span>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center space-x-2 mb-6">
          <Trash2 className="h-6 w-6 text-red-600" />
          <h2 className="text-2xl font-bold text-gray-900">Delete Report</h2>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="Search by serial number, customer name, or phone number..."
          />
        </div>
      </div>

      {isSearching && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="space-y-4">
          <div className="text-sm text-gray-600 mb-4">
            Found {searchResults.length} report{searchResults.length !== 1 ? 's' : ''}
          </div>
          {searchResults.map((report) => (
            <div key={report.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-semibold text-gray-900">Report #{report.id}</span>
                  {getStatusBadge(report)}
                </div>
                <button
                  onClick={() => initiateDelete(report)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors flex items-center space-x-2"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Hash className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Serial Number</p>
                    <p className="text-sm text-gray-900">{report.serial_number || 'Not specified'}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Customer</p>
                    <p className="text-sm text-gray-900">{report.customer_name}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Phone</p>
                    <p className="text-sm text-gray-900">{report.phone_number}</p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-1">Problem Description</p>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{report.problem_description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-700">Date Given</p>
                  <p className="text-gray-900">{formatDate(report.date_given)}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Date Diagnosed</p>
                  <p className="text-gray-900">{formatDate(report.date_diagnosed)}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Date Returned</p>
                  <p className="text-gray-900">{formatDate(report.date_returned)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {searchTerm.trim() && !isSearching && searchResults.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
          <p className="text-gray-600">Try adjusting your search terms or check if the report exists.</p>
        </div>
      )}

      {!searchTerm.trim() && !isSearching && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Trash2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Reports</h3>
          <p className="text-gray-600">Search for reports to delete. This action cannot be undone.</p>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog && reportToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Confirm Delete</h3>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete this report? This action cannot be undone.
              </p>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-medium text-gray-900">Report #{reportToDelete.id}</p>
                <p className="text-sm text-gray-600">Customer: {reportToDelete.customer_name}</p>
                <p className="text-sm text-gray-600">Serial: {reportToDelete.serial_number}</p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
              </button>
              
              <button
                onClick={cancelDelete}
                disabled={isDeleting}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteReport;
