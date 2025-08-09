import React, { useState } from 'react';
import { Save, RotateCcw, Calendar } from 'lucide-react';
import { addReport } from '../services/api';
import { ReportFormData } from '../types/Report';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const SubmitReport: React.FC = () => {
  const [formData, setFormData] = useState<ReportFormData>({
    serial_number: '',
    customer_name: '',
    phone_number: '',
    problem_description: '',
    date_given: format(new Date(), 'yyyy-MM-dd'),
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.serial_number || !formData.customer_name || !formData.phone_number || !formData.problem_description) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await apiService.createReport(formData);
      toast.success('Report submitted successfully!');
      handleClear();
    } catch (error) {
      toast.error('Failed to submit report');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClear = () => {
    setFormData({
      serial_number: '',
      customer_name: '',
      phone_number: '',
      problem_description: '',
      date_given: format(new Date(), 'yyyy-MM-dd'),
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Save className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Submit New Report</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="serial_number" className="block text-sm font-medium text-gray-700 mb-2">
                Serial Number *
              </label>
              <input
                type="text"
                id="serial_number"
                name="serial_number"
                value={formData.serial_number}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter serial number"
                required
              />
            </div>

            <div>
              <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700 mb-2">
                Customer Name *
              </label>
              <input
                type="text"
                id="customer_name"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter customer name"
                required
              />
            </div>

            <div>
              <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter phone number"
                required
              />
            </div>

            <div>
              <label htmlFor="date_given" className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Date Given *
              </label>
              <input
                type="date"
                id="date_given"
                name="date_given"
                value={formData.date_given}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="problem_description" className="block text-sm font-medium text-gray-700 mb-2">
              Problem Description *
            </label>
            <textarea
              id="problem_description"
              name="problem_description"
              value={formData.problem_description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
              placeholder="Describe the problem in detail..."
              required
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{isSubmitting ? 'Submitting...' : 'Submit Report'}</span>
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
    </div>
  );
};

export default SubmitReport;
