import React, { useState } from 'react';
import { Edit, Save, Search, Loader2, ChevronLeft } from 'lucide-react';
import { getReports, updateReport } from '../services/api';
import { Report, ReportFormData } from '../types/Report';
import toast from 'react-hot-toast';
import { format, isValid } from 'date-fns';

const UpdateReport: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Report[]>([]);
  const [currentReport, setCurrentReport] = useState<Report | null>(null);
  const [formData, setFormData] = useState<ReportFormData | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const statusOptions = [
    'Pending Diagnosis',
    'Diagnosed - Awaiting Approval',
    'Awaiting Parts',
    'Repair in Progress',
    'Ready for Pickup',
    'Returned to Customer'
  ];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      toast.error('Please enter a search term.');
      return;
    }
    setIsSearching(true);
    setCurrentReport(null);
    setFormData(null);
    setSearchResults([]);
    try {
      const results = await getReports(searchTerm);
      if (results.length === 0) {
        toast.error("No reports found.");
      } else if (results.length === 1) {
        selectReportForEditing(results[0]);
      } else {
        setSearchResults(results);
      }
    } catch (error) {
      toast.error("Failed to search for reports.");
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  const selectReportForEditing = (report: Report) => {
    setCurrentReport(report);
    const formattedDate = isValid(new Date(report.date_given))
      ? format(new Date(report.date_given), 'yyyy-MM-dd')
      : '';
    setFormData({
      serial_number: report.serial_number,
      customer_name: report.customer_name,
      phone_number: report.phone_number,
      problem_description: report.problem_description,
      date_given: formattedDate,
      status: report.status || 'Pending Diagnosis',
    });
    setSearchResults([]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!formData) return;
    const { name, value } = e.target;
    setFormData(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData || !currentReport) return;

    setIsUpdating(true);
    try {
      await updateReport(currentReport.id, formData);
      toast.success("Report updated successfully!");
    } catch (error) {
      toast.error("Failed to update report.");
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const clearSelection = () => {
    setCurrentReport(null);
    setFormData(null);
    setSearchResults([]);
    setSearchTerm('');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        {!currentReport && (
          <>
            <div className="flex items-center space-x-2 mb-6">
              <Edit className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Update Report</h2>
            </div>
            <form onSubmit={handleSearch} className="flex gap-4 mb-6">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-grow px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Search by Name, Phone, or Serial #"
                disabled={isSearching}
              />
              <button type="submit" disabled={isSearching} className="bg-blue-600 text-white p-2 rounded-lg">
                {isSearching ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
              </button>
            </form>
          </>
        )}

        {searchResults.length > 0 && (
          <div className="space-y-2 border-t pt-4">
            <h3 className="font-semibold">Multiple reports found. Select one to edit:</h3>
            {searchResults.map(report => (
              <div key={report.id} onClick={() => selectReportForEditing(report)} className="p-3 border rounded-lg hover:bg-gray-100 cursor-pointer">
                <p className="font-bold">{report.customer_name}</p>
                <p className="text-sm text-gray-600">{report.serial_number}</p>
              </div>
            ))}
          </div>
        )}

        {currentReport && formData && (
          <div>
            <button onClick={clearSelection} className="flex items-center text-sm text-blue-600 hover:underline mb-4">
              <ChevronLeft className="h-4 w-4" /> Back to Search
            </button>
            <form onSubmit={handleUpdate} className="space-y-6 border-t pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select id="status" name="status" value={formData.status} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-lg">
                    {statusOptions.map(option => <option key={option}>{option}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
                  <input id="customer_name" name="customer_name" value={formData.customer_name} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-lg"/>
                </div>
                <div>
                  <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input id="phone_number" name="phone_number" value={formData.phone_number} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-lg"/>
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="date_given" className="block text-sm font-medium text-gray-700 mb-2">Date Given</label>
                  <input id="date_given" type="date" name="date_given" value={formData.date_given} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-lg"/>
                </div>
              </div>
              <div>
                <label htmlFor="problem_description" className="block text-sm font-medium text-gray-700 mb-2">Problem Description</label>
                <textarea id="problem_description" name="problem_description" value={formData.problem_description} onChange={handleInputChange} rows={4} className="w-full p-2 border border-gray-300 rounded-lg"/>
              </div>
              <button
                type="submit"
                disabled={isUpdating}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
              >
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateReport;
