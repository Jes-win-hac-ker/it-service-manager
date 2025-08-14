import React, { useState, useEffect, useCallback } from 'react';
import { Search, Calendar, Phone, User, Hash, Loader2, X, CheckCircle2, Zap, Edit, Save, Trash2, AlertTriangle, Store, Package, Bell } from 'lucide-react';
import { getReports, updateReport, deleteReport } from '../services/api';
import { Report, ReportFormData } from '../types/Report';
import { format, isValid } from 'date-fns';
import toast from 'react-hot-toast';

const REPORTS_PER_PAGE = 15;

const SearchReports: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // State for modals
  const [reportToEdit, setReportToEdit] = useState<Report | null>(null);
  const [reportToDelete, setReportToDelete] = useState<Report | null>(null);
  const [formData, setFormData] = useState<ReportFormData | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // State for reminder in edit modal
  const [showReminder, setShowReminder] = useState(false);
  const [reminderDateTime, setReminderDateTime] = useState('');

  const statusOptions = [
    'Pending Diagnosis',
    'Diagnosed - Awaiting Approval',
    'Awaiting Parts',
    'Repair in Progress',
    'Ready for Pickup',
    'Returned to Customer'
  ];

  const fetchReports = useCallback(async (search: string, pageNum: number) => {
    if (pageNum === 0) setIsLoading(true);
    else setIsLoadingMore(true);

    try {
      const data = await getReports(search, pageNum, REPORTS_PER_PAGE);
      setReports(prev => (pageNum === 0 ? data : [...prev, ...data]));
      setHasMore(data.length === REPORTS_PER_PAGE);
    } catch (error) {
      toast.error("Could not fetch reports.");
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setPage(0);
      fetchReports(searchTerm, 0);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm, fetchReports]);
  
  // Ask for notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const openEditModal = (report: Report) => {
    setReportToEdit(report);
    setShowReminder(false); // Reset reminder view
    setReminderDateTime(''); // Reset reminder time
    const formatDateForInput = (date?: string) => {
        if (!date) return '';
        return isValid(new Date(date)) ? format(new Date(date), 'yyyy-MM-dd') : '';
    }
    setFormData({
      serial_number: report.serial_number,
      customer_name: report.customer_name,
      phone_number: report.phone_number,
      problem_description: report.problem_description,
      date_given: formatDateForInput(report.date_given),
      status: report.status || 'Pending Diagnosis',
      invoice_number: report.invoice_number || '',
      part_name: report.part_name || '',
      shop_name: report.shop_name || '',
      part_number: report.part_number || '',
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData || !reportToEdit) return;
    
    setIsUpdating(true);
    try {
      await updateReport(reportToEdit.id, formData);

      // Schedule notification if reminder is set
      if (showReminder && reminderDateTime && new Date(reminderDateTime) > new Date()) {
        const reminderTime = new Date(reminderDateTime).getTime();
        const now = new Date().getTime();
        const delay = reminderTime - now;

        setTimeout(() => {
          if (Notification.permission === 'granted') {
            new Notification('IT Service Reminder', {
              body: `The report for ${formData.customer_name} (S/N: ${formData.serial_number}) is due for completion.`,
            });
          }
        }, delay);
        toast.success('Report updated and reminder set!');
      } else {
        toast.success("Report updated successfully!");
      }

      setReportToEdit(null);
      fetchReports(searchTerm, 0);
    } catch (error) {
      toast.error("Failed to update report.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!reportToDelete) return;
    setIsDeleting(true);
    try {
      await deleteReport(reportToDelete.id);
      toast.success("Report deleted successfully!");
      setReportToDelete(null);
      fetchReports(searchTerm, 0);
    } catch (error) {
      toast.error("Failed to delete report.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!formData) return;
    const { name, value } = e.target;
    setFormData(prev => (prev ? { ...prev, [name]: value } : null));
  };
  
  const handleSearchFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchReports(searchTerm, nextPage);
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    return isValid(d) ? format(d, 'PPP') : 'Invalid Date';
  };

  const getStatusIndicator = (status: string) => {
    if (status === 'Returned to Customer') {
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    }
    return <Zap className="h-5 w-5 text-yellow-500" />;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-2 mb-6">
            <Search className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Search, Update & Delete</h2>
        </div>
        <form onSubmit={handleSearchFormSubmit} className="relative mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
            placeholder="Search by Serial #, Name, or Phone..."
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')} 
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
              type="button"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </form>

        <div className="space-y-4">
          {isLoading ? (
             <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
             </div>
          ) : reports.length > 0 ? (
            reports.map((report) => (
              <div key={report.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div className="flex items-center">
                    <div className="mr-3">{getStatusIndicator(report.status)}</div>
                    <div>
                      <p className="font-bold text-lg text-gray-800 dark:text-gray-100">{report.customer_name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{report.serial_number}</p>
                    </div>
                  </div>
                  <div className="text-right">
                     <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{report.status}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{formatDate(report.date_given)}</p>
                  </div>
                </div>
                <p className="mt-4 text-gray-700 dark:text-gray-300">{report.problem_description}</p>
                {(report.part_name || report.invoice_number || report.shop_name || report.part_number) && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    {report.part_name && <p className="flex items-center"><Package className="h-4 w-4 mr-2"/>Part: {report.part_name}</p>}
                    {report.part_number && <p className="flex items-center"><Hash className="h-4 w-4 mr-2"/>Part #: {report.part_number}</p>}
                    {report.invoice_number && <p className="flex items-center"><Hash className="h-4 w-4 mr-2"/>Invoice: {report.invoice_number}</p>}
                    {report.shop_name && <p className="flex items-center"><Store className="h-4 w-4 mr-2"/>Shop: {report.shop_name}</p>}
                  </div>
                )}
                <div className="flex justify-end items-center gap-2 mt-2">
                  <button onClick={() => openEditModal(report)} className="flex items-center gap-2 text-sm bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800">
                    <Edit className="h-4 w-4" /> Edit
                  </button>
                  <button onClick={() => setReportToDelete(report)} className="flex items-center gap-2 text-sm bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 px-3 py-1 rounded-md hover:bg-red-200 dark:hover:bg-red-800">
                    <Trash2 className="h-4 w-4" /> Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-10">No reports found.</p>
          )}
        </div>
        
        {hasMore && !isLoading && (
          <div className="mt-6 text-center">
            <button onClick={loadMore} disabled={isLoadingMore} className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-2 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50">
              {isLoadingMore ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
      </div>

      {reportToEdit && formData && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Edit Report</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              {/* Existing form fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} className="w-full p-2 border rounded-lg mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    {statusOptions.map(opt => <option key={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Customer Name</label>
                  <input name="customer_name" value={formData.customer_name} onChange={handleInputChange} className="w-full p-2 border rounded-lg mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
                </div>
              </div>

              {/* Optional Reminder Section */}
              {!showReminder && (
                <button type="button" onClick={() => setShowReminder(true)} className="w-full flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700">
                  <Bell className="h-5 w-5" />
                  Set Completion Reminder (Optional)
                </button>
              )}

              {showReminder && (
                <div className="border-t dark:border-gray-700 pt-4">
                  <label htmlFor="reminder" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Reminder Date & Time</label>
                  <input 
                    type="datetime-local" 
                    id="reminder" 
                    name="reminder" 
                    value={reminderDateTime}
                    onChange={(e) => setReminderDateTime(e.target.value)}
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              )}

              <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={() => setReportToEdit(null)} className="bg-gray-200 dark:bg-gray-600 py-2 px-4 rounded-lg">Cancel</button>
                <button type="submit" disabled={isUpdating} className="bg-green-600 text-white py-2 px-4 rounded-lg flex items-center gap-2">
                  {isUpdating ? <Loader2 className="h-4 w-4 animate-spin"/> : <Save className="h-4 w-4" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {reportToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-sm w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Delete Report</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Are you sure you want to delete the report for "{reportToDelete.customer_name}"?</p>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button type="button" onClick={handleDelete} disabled={isDeleting} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 sm:ml-3 sm:w-auto sm:text-sm">
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
              <button type="button" onClick={() => setReportToDelete(null)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 sm:mt-0 sm:w-auto sm:text-sm">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchReports;
