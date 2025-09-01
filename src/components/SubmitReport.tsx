import React, { useState } from 'react';
import { Save, RotateCcw, Calendar, PlusCircle, Hash, Package, Store, User, Phone } from 'lucide-react';
import { addPendingReport } from '../services/api';
import { ReportFormData } from '../types/Report';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';

const SubmitReport: React.FC = () => {
  const { user } = useAuth();
  const [showExtraFields, setShowExtraFields] = useState(false);
  const [formData, setFormData] = useState<ReportFormData>({
  serial_number: '',
  customer_name: '',
  customer_email: user?.email || '',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customer_name || !formData.phone_number || !formData.problem_description) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await addPendingReport(formData);
      toast.success('Report submitted for review!');
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
      customer_email: user?.email || '',
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
  };

  // Check for due reminders on mount
  React.useEffect(() => {
    const checkReminders = () => {
      const reminders = JSON.parse(localStorage.getItem('reportReminders') || '[]');
      const now = Date.now();
      let lastNotification = parseInt(localStorage.getItem('lastReportNotification') || '0', 10);
      let sent = false;
      const due = reminders.filter((r: any) => r.notifyAt <= now);
      if (due.length > 0) {
        due.forEach((r: any) => {
          // If a notification was sent within the last minute, wait one more minute
          if (now - lastNotification < 60 * 1000) {
            setTimeout(() => {
              toast(`Reminder: ${r.customer_name} - Status: ${r.status}`);
              localStorage.setItem('lastReportNotification', String(Date.now()));
            }, 60 * 1000 - (now - lastNotification));
          } else {
            toast(`Reminder: ${r.customer_name} - Status: ${r.status}`);
            localStorage.setItem('lastReportNotification', String(Date.now()));
          }
          sent = true;
        });
        // Remove shown reminders
        const remaining = reminders.filter((r: any) => r.notifyAt > now);
        localStorage.setItem('reportReminders', JSON.stringify(remaining));
      }
    };
    checkReminders();
    // Optionally, check every minute for new reminders
    const interval = setInterval(checkReminders, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-2xl w-full mx-auto px-2 sm:px-4">
      <div className="bg-white dark:bg-[#606060] rounded-lg shadow-md p-4 sm:p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Save className="h-6 w-6 text-brand-grey" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Submit New Report</h2>
        </div>
        
  <form onSubmit={handleSubmit} className="space-y-6">
     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Customer Name *</label>
              <input type="text" id="customer_name" name="customer_name" value={formData.customer_name} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#505050] text-gray-900 dark:text-white rounded-lg text-sm" placeholder="Enter customer name" required />
            </div>
            <div>
              <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number *</label>
              <input type="tel" id="phone_number" name="phone_number" value={formData.phone_number} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#505050] text-gray-900 dark:text-white rounded-lg text-sm" placeholder="Enter phone number" required />
            </div>
            <div>
              <label htmlFor="date_given" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date Given *</label>
              <input type="date" id="date_given" name="date_given" value={formData.date_given} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#505050] text-gray-900 dark:text-white rounded-lg text-sm" required />
            </div>
          </div>

          <div>
            <label htmlFor="problem_description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Problem Description *</label>
            <textarea id="problem_description" name="problem_description" value={formData.problem_description} onChange={handleInputChange} rows={4} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#505050] text-gray-900 dark:text-white rounded-lg text-sm" placeholder="Describe the problem..." required />
          </div>

          {showExtraFields && (
        <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Part & Invoice Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <div>
                    <label htmlFor="part_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"><Package className="inline h-4 w-4 mr-1"/>Part Name</label>
                    <input id="part_name" name="part_name" value={formData.part_name || ''} onChange={handleInputChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#454545] text-gray-900 dark:text-white rounded-lg text-sm"/>
                 </div>
                 <div>
                    <label htmlFor="part_number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"><Hash className="inline h-4 w-4 mr-1"/>Part Number</label>
                    <input id="part_number" name="part_number" value={formData.part_number || ''} onChange={handleInputChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#454545] text-gray-900 dark:text-white rounded-lg text-sm"/>
                 </div>
                 <div>
                    <label htmlFor="invoice_number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"><Hash className="inline h-4 w-4 mr-1"/>Invoice Number</label>
                    <input id="invoice_number" name="invoice_number" value={formData.invoice_number || ''} onChange={handleInputChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#454545] text-gray-900 dark:text-white rounded-lg text-sm"/>
                 </div>
                 <div>
                    <label htmlFor="shop_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"><Store className="inline h-4 w-4 mr-1"/>Shop Purchased From</label>
                    <input id="shop_name" name="shop_name" value={formData.shop_name || ''} onChange={handleInputChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#454545] text-gray-900 dark:text-white rounded-lg text-sm"/>
                 </div>
               </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-brand-grey text-white py-2 px-4 rounded-lg hover:bg-brand-grey-light disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>
            {!showExtraFields ? (
              <button 
                type="button" 
                onClick={() => setShowExtraFields(true)} 
                className="w-full sm:w-auto bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 flex items-center justify-center gap-2"
              >
                <PlusCircle className="h-5 w-5" />
                Add Parts
              </button>
            ) : (
              <button 
                type="button" 
                onClick={handleClear} 
                className="w-full sm:w-auto bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700"
              >
                Clear Form
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitReport;
