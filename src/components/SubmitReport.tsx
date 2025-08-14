import React, { useState, useEffect } from 'react';
import { Save, RotateCcw, Calendar, PlusCircle, Hash, Package, Store, User, Phone, Bell } from 'lucide-react';
import { addReport } from '../services/api';
import { ReportFormData } from '../types/Report';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const SubmitReport: React.FC = () => {
  const [showExtraFields, setShowExtraFields] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const [reminderDateTime, setReminderDateTime] = useState('');
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
    part_number: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ask for notification permission when the component loads
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

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

      // Schedule the notification if a reminder time is set
      if (showReminder && reminderDateTime && new Date(reminderDateTime) > new Date()) {
        const reminderTime = new Date(reminderDateTime).getTime();
        const now = new Date().getTime();
        const delay = reminderTime - now;

        setTimeout(() => {
          if (Notification.permission === 'granted') {
            new Notification('IT Service Reminder', {
              body: `The report for ${formData.customer_name} (S/N: ${formData.serial_number}) is due for completion.`,
              // You can add an icon here, e.g., icon: '/logo.png'
            });
          }
        }, delay);
        toast.success('Report submitted and reminder set!');
      } else {
        toast.success('Report submitted successfully!');
      }

      handleClear();
    } catch (error) {
      toast.error('Failed to submit report');
      console.error("Submission Error:", error);
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
      part_number: '',
    });
    setShowExtraFields(false);
    setShowReminder(false);
    setReminderDateTime('');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Save className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Submit New Report</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main form fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="serial_number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Serial Number *</label>
              <input type="text" id="serial_number" name="serial_number" value={formData.serial_number} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg" placeholder="Enter serial number" required />
            </div>
            <div>
              <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Customer Name *</label>
              <input type="text" id="customer_name" name="customer_name" value={formData.customer_name} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg" placeholder="Enter customer name" required />
            </div>
            <div>
              <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number *</label>
              <input type="tel" id="phone_number" name="phone_number" value={formData.phone_number} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg" placeholder="Enter phone number" required />
            </div>
            <div>
              <label htmlFor="date_given" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date Given *</label>
              <input type="date" id="date_given" name="date_given" value={formData.date_given} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg" required />
            </div>
          </div>

          <div>
            <label htmlFor="problem_description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Problem Description *</label>
            <textarea id="problem_description" name="problem_description" value={formData.problem_description} onChange={handleInputChange} rows={4} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg" placeholder="Describe the problem..." required />
          </div>

          {/* Optional Fields Toggle Buttons */}
          <div className="space-y-2">
            {!showExtraFields && (
              <button type="button" onClick={() => setShowExtraFields(true)} className="w-full flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700">
                <PlusCircle className="h-5 w-5" />
                Add Part / Invoice Details (Optional)
              </button>
            )}
            {!showReminder && (
              <button type="button" onClick={() => setShowReminder(true)} className="w-full flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700">
                <Bell className="h-5 w-5" />
                Set Completion Reminder (Optional)
              </button>
            )}
          </div>

          {showExtraFields && (
            <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4">
               <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Part & Invoice Details</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label htmlFor="part_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"><Package className="inline h-4 w-4 mr-1"/>Part Name</label>
                    <input id="part_name" name="part_name" value={formData.part_name || ''} onChange={handleInputChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"/>
                 </div>
                 <div>
                    <label htmlFor="part_number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"><Hash className="inline h-4 w-4 mr-1"/>Part Number</label>
                    <input id="part_number" name="part_number" value={formData.part_number || ''} onChange={handleInputChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"/>
                 </div>
                 <div>
                    <label htmlFor="invoice_number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"><Hash className="inline h-4 w-4 mr-1"/>Invoice Number</label>
                    <input id="invoice_number" nam
