import React, { useState, useEffect, useCallback } from 'react';
import { Search, Calendar, Phone, User, Hash, Loader2, X, CheckCircle2, Zap, Edit, Save } from 'lucide-react';
import { getReports, updateReport } from '../services/api';
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

  // State for the edit modal
  const [reportToEdit, setReportToEdit] = useState<Report | null>(null);
  const [formData, setFormData] = useState<ReportFormData | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

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

  const openEditModal = (report: Report) => {
    setReportToEdit(report);
    const formattedDate = isValid(new Date(report.date_given)) ? format(new Date(report.date_given), 'yyyy-MM-dd') : '';
    setFormData({
      serial_number: report.serial_number,
      customer_name: report.customer_name,
      phone_number: report.phone_number,
      problem_description: report.problem_description,
      date_given: formattedDate,
      status: report.status || 'Pending Diagnosis',
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData || !reportToEdit) return;
    
    setIsUpdating(true);
    try {
      await updateReport(reportToEdit.id, formData);
      toast.success("Report updated successfully!");
      setReportToEdit(null); // Close modal
      fetchReports(searchTerm, 0); // Refresh the list
    } catch (error) {
      toast.error("Failed to update report.");
    } finally {
      setIsUpdating(false);
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
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-2 mb-6">
            <Search className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Search & Update Reports</h2>
        </div>
        <form onSubmit={handleSearchFormSubmit} className="relative mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Search by Serial #, Name, or Phone..."
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')} 
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-800"
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
              <p className="ml-2 text-gray-500">Loading reports...</p>
            </div>
          ) : reports.length > 0 ? (
            reports.map((report) => (
              <div key={report.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div className="flex items-center">
                    <div className="mr-3">
                      {getStatusIndicator(report.status)}
                    </div>
                    <div>
                      <p className="font-bold text-lg text-gray-800 flex items-center">
                        <User className="h-4 w-4 mr-2" /> {report.customer_name}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center">
                        <Hash className="h-4 w-4 mr-2" /> {report.serial_number}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                     <p className="text-sm font-semibold text-gray-700">{report.status}</p>
                    <p className="text-sm text-gray-600 flex items-center justify-end mt-1">
                      <Calendar className="h-4 w-4 mr-2" />
                      Given: {formatDate(report.date_given)}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-gray-700">{report.problem_description}</p>
                <div className="flex justify-end mt-2">
                  <button onClick={() => openEditModal(report)} className="flex items-center gap-2 text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200">
                    <Edit className="h-4 w-4" />
                    Edit
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-10">No reports found.</p>
          )}
        </div>
        
        {hasMore && !isLoading && (
          <div className="mt-6 text-center">
            <button
              onClick={loadMore}
              disabled={isLoadingMore}
              className="bg-gray-200 text-gray-800 py-2 px-6 rounded-lg hover:bg-gray-300 disabled:opacity-50 flex items-center justify-center mx-auto"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                'Load More'
              )}
            </button>
          </div>
        )}
      </div>

      {reportToEdit && formData && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Edit Report</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} className="w-full p-2 border rounded-lg mt-1">
                    {statusOptions.map(opt => <option key={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium">Customer Name</label>
                  <input name="customer_name" value={formData.customer_name} onChange={handleInputChange} className="w-full p-2 border rounded-lg mt-1"/>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium">Problem Description</label>
                <textarea name="problem_description" value={formData.problem_description} onChange={handleInputChange} rows={3} className="w-full p-2 border rounded-lg mt-1"/>
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={() => setReportToEdit(null)} className="bg-gray-200 py-2 px-4 rounded-lg">Cancel</button>
                <button type="submit" disabled={isUpdating} className="bg-green-600 text-white py-2 px-4 rounded-lg flex items-center gap-2">
                  {isUpdating ? <Loader2 className="h-4 w-4 animate-spin"/> : <Save className="h-4 w-4" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchReports;
