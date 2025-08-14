import React, { useState } from 'react';
import { Save, RotateCcw, Calendar, PlusCircle, Hash, Package, Store } from 'lucide-react';
import { addReport } from '../services/api';
import { ReportFormData } from '../types/Report';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const SubmitReport: React.FC = () => {
  const [showExtraFields, setShowExtraFields] = useState(false);
  const [formData, setFormData] = useState<ReportFormData>({
    serial_number: '',
    customer_name: '',
    phone_number: '',
    problem_description: '',
    date_given: format(new Date(), 'yyyy-MM-dd'),
    status: 'Pending Diagnosis',
    invoice_number: '',
    part_name: '',
    shop_name: '',
    part_number: '', // Initialize new field
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
      await addReport(formData);
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
      status: 'Pending Diagnosis',
      invoice_number: '',
      part_name: '',
      shop_name: '',
      part_number: '', // Clear new field
    });
    setShowExtraFields(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Submit New Report</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main form fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="serial_number" className="block text-sm font-medium">Serial Number *</label>
              <input type="text" id="serial_number" name="serial_number" value={formData.serial_number} onChange={handleInputChange} className="w-full p-2 border rounded-lg mt-1" required />
            </div>
            <div>
              <label htmlFor="customer_name" className="block text-sm font-medium">Customer Name *</label>
              <input type="text" id="customer_name" name="customer_name" value={formData.customer_name} onChange={handleInputChange} className="w-full p-2 border rounded-lg mt-1" required />
            </div>
            <div>
              <label htmlFor="phone_number" className="block text-sm font-medium">Phone Number *</label>
              <input type="tel" id="phone_number" name="phone_number" value={formData.phone_number} onChange={handleInputChange} className="w-full p-2 border rounded-lg mt-1" required />
            </div>
            <div>
              <label htmlFor="date_given" className="block text-sm font-medium">Date Given *</label>
              <input type="date" id="date_given" name="date_given" value={formData.date_given} onChange={handleInputChange} className="w-full p-2 border rounded-lg mt-1" required />
            </div>
          </div>
          <div>
            <label htmlFor="problem_description" className="block text-sm font-medium">Problem Description *</label>
            <textarea id="problem_description" name="problem_description" value={formData.problem_description} onChange={handleInputChange} rows={4} className="w-full p-2 border rounded-lg mt-1" required />
          </div>

          {!showExtraFields && (
            <button type="button" onClick={() => setShowExtraFields(true)} className="w-full flex items-center justify-center gap-2 text-blue-600 py-2 rounded-lg hover:bg-blue-50">
              <PlusCircle className="h-5 w-5" />
              Add Part / Invoice Details (Optional)
            </button>
          )}

          {showExtraFields && (
            <div className="space-y-4 border-t pt-4">
               <h3 className="font-semibold text-lg">Part & Invoice Details</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label htmlFor="part_name" className="block text-sm font-medium">Part Name</label>
                    <input id="part_name" name="part_name" value={formData.part_name || ''} onChange={handleInputChange} className="w-full p-2 border rounded-lg mt-1"/>
                 </div>
                 <div>
                    <label htmlFor="part_number" className="block text-sm font-medium">Part Number</label>
                    <input id="part_number" name="part_number" value={formData.part_number || ''} onChange={handleInputChange} className="w-full p-2 border rounded-lg mt-1"/>
                 </div>
                 <div>
                    <label htmlFor="invoice_number" className="block text-sm font-medium">Invoice Number</label>
                    <input id="invoice_number" name="invoice_number" value={formData.invoice_number || ''} onChange={handleInputChange} className="w-full p-2 border rounded-lg mt-1"/>
                 </div>
                 <div>
                    <label htmlFor="shop_name" className="block text-sm font-medium">Shop Purchased From</label>
                    <input id="shop_name" name="shop_name" value={formData.shop_name || ''} onChange={handleInputChange} className="w-full p-2 border rounded-lg mt-1"/>
                 </div>
               </div>
            </div>
          )}

          <div className="flex space-x-4 pt-4">
            <button type="submit" disabled={isSubmitting} className="flex-1 bg-blue-600 text-white py-2 rounded-lg">
              Submit Report
            </button>
            <button type="button" onClick={handleClear} className="flex-1 bg-gray-600 text-white py-2 rounded-lg">
              Clear Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitReport;
