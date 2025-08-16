import React, { useState, useEffect } from 'react';
import { Save, RotateCcw, Calendar, PlusCircle, Bell, Package, Hash, Store, User, Phone } from 'lucide-react';
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSetReminderClick = () => {
    if (!('Notification' in window)) {
      toast.error('This browser does not support notifications.');
      return;
    }

    if (Notification.permission === 'granted') {
      setShowReminder(true);
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          setShowReminder(true);
        } else {
          toast.error('Notification permission was denied.');
        }
      });
    } else {
      toast.error('Notifications are blocked. Please enable them in your browser settings for this site.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customer_name || !formData.phone_number || !formData.problem_description) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await addReport(formData);

      if (showReminder && reminderDateTime && new Date(reminderDateTime) > new Date()) {
        const reminderTime = new Date(reminderDateTime).getTime();
        const now = new Date().getTime();
        const delay = reminderTime - now;

        setTimeout(() => {
          if (Notification.permission === 'granted') {
            new Notification('IT Service Reminder', {
              body: `The report for ${formData.customer_name} is due for completion.`,
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
          <Save className="h-6 w-6 text-brand-grey" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Submit New Report</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <div className="space-y-2">
            {!showExtraFields && (
              <button type="button" onClick={() => setShowExtraFields(true)} className="w-full flex items-center justify-center gap-2 text-brand-grey py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <PlusCircle className="h-5 w-5" />
                Add Part / Invoice Details (Optional)
              </button>
            )}
            {!showReminder && (
              <button type="button" onClick={handleSetReminderClick} className="w-full flex items-center justify-center gap-2 text-brand-grey py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
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
                    <input id="invoice_number" name="invoice_number" value={formData.invoice_number || ''} onChange={handleInputChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"/>
                 </div>
                 <div>
                    <label htmlFor="shop_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"><Store className="inline h-4 w-4 mr-1"/>Shop Purchased From</label>
                    <input id="shop_name" name="shop_name" value={formData.shop_name || ''} onChange={handleInputChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"/>
                 </div>
               </div>
            </div>
          )}

          {showReminder && (
            <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Set Reminder</h3>
              <div>
                <label htmlFor="reminder" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Reminder Date & Time</label>
                <input 
                  type="datetime-local" 
                  id="reminder" 
                  name="reminder" 
                  value={reminderDateTime}
                  onChange={(e) => setReminderDateTime(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
                />
              </div>
            </div>
          )}

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-brand-grey text-white py-2 px-4 rounded-lg hover:bg-brand-grey-light disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>
            <button type="button" onClick={handleClear} className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700">
              Clear Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitReport;
