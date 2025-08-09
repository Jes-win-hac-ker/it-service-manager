import React, { useState, useEffect } from 'react';
import { Edit, Save, RotateCcw, Search, Calendar } from 'lucide-react';
import { getReportById, updateReport } from '../services/api';
import { Report, ReportFormData } from '../types/Report';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const UpdateReport: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [searchResults, setSearchResults] = useState<Report[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState<ReportFormData>({
    serial_number: '',
    customer_name: '',
    phone_number: '',
    problem_description: '',
    date_given: '',
    date_diagnosed: '',
    date_returned: '',
  });

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

  const selectReport = (report: Report) => {
    setSelectedReport(report);
    setFormData({
      serial_number: report.serial_number || '',
      customer_name: report.customer_name || '',
      phone_number: report.phone_number || '',
      problem_description: report.problem_description || '',
      date_given: report.date_given || '',
      date_diagnosed: report.date_diagnosed || '',
      date_returned: report.date_returned || '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedReport) {
      toast.error('Please select a report to update');
      return;
    }

    setIsUpdating(true);
    try {
      await apiService.updateReport(selectedReport.id!, formData);
      toast.success('Report updated successfully!');
      setSelectedReport(null);
      setSearchTerm('');
      setSearchResults([]);
    } catch (error) {
      toast.error('Failed to update report');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClear = () => {
    setSelectedReport(null);
    setSearchTerm('');
    setSearchResults([]);
    setFormData({
      serial_number: '',
      customer_name: '',
      phone_number: '',
      problem_description: '',
      date_given: '',
      date_diagnosed: '',
      date_returned: '',
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch {
      return dateString;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center space-x-2 mb-6">
          <Edit className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Update Report</h2>
        </div>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="Search by serial number, customer name, or phone number..."
          />
        </div>

        {isSearching && (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        )}

        {searchResults.length > 0 && (
          <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
            <h3 className="text-sm font-medium text-gray-700">Select a report to update:</h3>
            {searchResults.map((report) => (
              <div
                key={report.id}
                onClick={() => selectReport(report)}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedReport?.id === report.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">
                      {report.customer_name} - #{report.serial_number}
                    </p>
                    <p className="text-sm text-gray-600">{report.phone_number}</p>
                    <p className="text-sm text-gray-500">Given: {formatDate(report.date_given)}</p>
                  </div>
                  <span className="text-xs text-gray-500">ID: {report.id}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedReport && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Update Report #{selectedReport.id}
          </h3>
          
          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="serial_number" className="block text-sm font-medium text-gray-700 mb-2">
                  Serial Number
                </label>
                <input
                  type="text"
                  id="serial_number"
                  name="serial_number"
                  value={formData.serial_number}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>

              <div>
                <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Name
                </label>
                <input
                  type="text"
                  id="customer_name"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>

              <div>
                <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>

              <div>
                <label htmlFor="date_given" className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Date Given
                </label>
                <input
                  type="date"
                  id="date_given"
                  name="date_given"
                  value={formData.date_given}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>

              <div>
                <label htmlFor="date_diagnosed" className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Date Diagnosed
                </label>
                <input
                  type="date"
                  id="date_diagnosed"
                  name="date_diagnosed"
                  value={formData.date_diagnosed}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>

              <div>
                <label htmlFor="date_returned" className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Date Returned
                </label>
                <input
                  type="date"
                  id="date_returned"
                  name="date_returned"
                  value={formData.date_returned}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="problem_description" className="block text-sm font-medium text-gray-700 mb-2">
                Problem Description
              </label>
              <textarea
                id="problem_description"
                name="problem_description"
                value={formData.problem_description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
              />
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={isUpdating}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{isUpdating ? 'Updating...' : 'Update Report'}</span>
              </button>
              
              <button
                type="button"
                onClick={handleClear}
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors flex items-center justify-center space-x-2"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Clear Form</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {!selectedReport && searchResults.length === 0 && searchTerm.trim() === '' && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Edit className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Update Report</h3>
          <p className="text-gray-600">Search for a report to update its information.</p>
        </div>
      )}
    </div>
  );
};

export default UpdateReport;
