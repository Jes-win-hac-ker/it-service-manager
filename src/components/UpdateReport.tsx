import React, { useState } from 'react';
import { Edit, Save, Search, RotateCcw, Calendar, User, Phone, Hash } from 'lucide-react';
import { getReportById, updateReport } from '../services/api';
import { Report, ReportFormData } from '../types/Report';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const UpdateReport: React.FC = () => {
  const [searchId, setSearchId] = useState('');
  const [currentReport, setCurrentReport] = useState<Report | null>(null);
  const [formData, setFormData] = useState<ReportFormData | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId) {
      toast.error('Please enter a Report ID to search.');
      return;
    }
    setIsSearching(true);
    setCurrentReport(null);
    setFormData(null);
    try {
      const report = await getReportById(searchId);
      setCurrentReport(report);
      // Ensure date is in 'yyyy-MM-dd' format for the input field
      const formattedDate = format(new Date(report.date_given), 'yyyy-MM-dd');
      setFormData({
        serial_number: report.serial_number,
        customer_name: report.customer_name,
        phone_number: report.phone_number,
        problem_description: report.problem_description,
        date_given: formattedDate,
      });
    } catch (error) {
      toast.error("Report not found.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      console.error("Update Error:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Edit className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Update Report</h2>
        </div>

        <form onSubmit={handleSearch} className="flex gap-4 mb-6">
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Report ID to find and edit"
          />
          <button 
            type="submit" 
            disabled={isSearching}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
          >
            {isSearching ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
          </button>
        </form>

        {currentReport && formData && (
          <form onSubmit={handleUpdate} className="space-y-6 border-t pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="serial_number" className="block text-sm font-medium text-gray-700 mb-2">Serial Number</label>
                <input id="serial_number" name="serial_number" value={formData.serial_number} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-lg"/>
              </div>
              <div>
                <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
                <input id="customer_name" name="customer_name" value={formData.customer_name} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-lg"/>
              </div>
              <div>
                <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input id="phone_number" name="phone_number" value={formData.phone_number} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-lg"/>
              </div>
              <div>
                <label htmlFor="date_given" className="block text-sm font-medium text-gray-700 mb-2">Date Given</label>
                <input type="date" id="date_given" name="date_given" value={formData.date_given} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-lg"/>
              </div>
            </div>
            <div>
              <label htmlFor="problem_description" className="block text-sm font-medium text-gray-700 mb-2">Problem Description</label>
              <textarea id="problem_description" name="problem_description" value={formData.problem_description} onChange={handleInputChange} rows={4} className="w-full p-2 border border-gray-300 rounded-lg"/>
            </div>
            <button
              type="submit"
              disabled={isUpdating}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default UpdateReport;
