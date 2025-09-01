import React, { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle, AlertCircle, LogOut, User, MessageCircle } from 'lucide-react';
import ClientFooter from './ClientFooter';
import { useAuth } from '../contexts/AuthContext';
import { getReports, addPendingReport, getPendingReports } from '../services/api';
import { Report, ReportFormData } from '../types/Report';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const ClientDashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('submit');
  const [userReports, setUserReports] = useState<Report[]>([]);
  const [pendingReports, setPendingReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ReportFormData>({
  serial_number: '',
  customer_name: '',
  customer_email: '',
  phone_number: '',
  problem_description: '',
  date_given: format(new Date(), 'yyyy-MM-dd'),
  status: 'Received',
  });
  const [feedback, setFeedback] = useState('');
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === 'status') {
      loadUserReports();
      loadPendingReports();
    }
  }, [activeTab]);
  const loadUserReports = async () => {
    setIsLoading(true);
    try {
      const allReports = await getReports();
      const filtered = allReports.filter((report: Report) =>
        report.customer_email?.toLowerCase() === user?.email?.toLowerCase()
      );
      setUserReports(filtered);
    } catch (error) {
      toast.error('Failed to load reports');
    } finally {
      setIsLoading(false);
    }
  };

  const loadPendingReports = async () => {
    try {
      const allPending = await getPendingReports();
      const filteredPending = allPending.filter((report: Report) =>
        report.customer_email?.toLowerCase() === user?.email?.toLowerCase()
      );
      setPendingReports(filteredPending);
    } catch (error) {
      toast.error('Failed to load pending reports');
    }
  };

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

    setIsLoading(true);
    try {
      await addPendingReport({
        ...formData,
        customer_email: user?.email || '', // Store email separately
      });
      toast.success('Report submitted successfully!');
      setFormData({
        serial_number: '',
        customer_name: '',
        customer_email: '',
        phone_number: '',
        problem_description: '',
        date_given: format(new Date(), 'yyyy-MM-dd'),
        status: 'Received',
      });
    } catch (error) {
      toast.error('Failed to submit report');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (report: Report) => {
    if (report.status === 'Completed') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          <CheckCircle className="h-4 w-4 mr-1" />
          Completed
        </span>
      );
    } else if (report.status === 'In Progress') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
          <AlertCircle className="h-4 w-4 mr-1" />
          In Progress
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          <Clock className="h-4 w-4 mr-1" />
          Received
        </span>
      );
    }
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
  <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#18181b]">
      {/* Header */}
  <header className="bg-white dark:bg-[#18181b] shadow-sm border-b border-gray-200 dark:border-gray-700 outline outline-2 outline-[#e0e7ef] [box-shadow:0_0_32px_8px_rgba(80,120,255,0.18)] dark:outline dark:outline-2 dark:outline-[#23272f] dark:[box-shadow:0_0_16px_2px_rgba(35,39,47,0.7)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">IT Service Manager</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                <User className="h-4 w-4" />
                <span>{user?.email}</span>
              </div>
              <button
                onClick={signOut}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>
  <main className="flex-1 max-w-7xl w-full mx-auto py-8 px-4 sm:px-6 lg:px-8 overflow-y-auto">
      {activeTab === 'submit' ? (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-[#18181b] rounded-lg shadow-md p-6 outline outline-2 outline-[#e0e7ef] [box-shadow:0_0_48px_12px_rgba(80,120,255,0.18)] dark:outline dark:outline-2 dark:outline-[#23272f] dark:[box-shadow:0_0_24px_4px_rgba(35,39,47,0.7)]">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Submit New Report</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="customer_name"
                    name="customer_name"
                    value={formData.customer_name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-blue-500 outline-none shadow-sm focus:border-blue-700 focus:ring-blue-500 bg-white dark:bg-[#23272f] text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone_number"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-blue-500 outline-none shadow-sm focus:border-blue-700 focus:ring-blue-500 bg-white dark:bg-[#23272f] text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="problem_description" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Problem Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="problem_description"
                    name="problem_description"
                    value={formData.problem_description}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-blue-500 outline-none shadow-sm focus:border-blue-700 focus:ring-blue-500 bg-white dark:bg-[#23272f] text-gray-900 dark:text-white"
                    rows={4}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Reports</h2>
            <button
              onClick={loadUserReports}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Clock className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          </div>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (userReports.length > 0 || pendingReports.length > 0) ? (
            <div className="space-y-4">
              {/* Pending Reports */}
              {pendingReports.map((report) => (
                <div key={report.id} className="bg-yellow-50 dark:bg-[#23272f] rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Report #{report.id}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Serial: {report.serial_number}</p>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                      <Clock className="h-4 w-4 mr-1" /> Pending Review
                    </span>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Problem Description</p>
                    <p className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-[#18181b] p-3 rounded-lg">{report.problem_description}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-gray-700 dark:text-gray-200">Date Submitted</p>
                      <p className="text-gray-900 dark:text-white">{formatDate(report.date_given)}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700 dark:text-gray-200">Status</p>
                      <p className="text-gray-900 dark:text-white">Pending Review</p>
                    </div>
                  </div>
                </div>
              ))}
              {/* Processed Reports */}
              {userReports.map((report) => (
                <div key={report.id} className="bg-white dark:bg-[#18181b] rounded-lg shadow-md p-6 outline outline-2 outline-[#e0e7ef] [box-shadow:0_0_48px_12px_rgba(80,120,255,0.18)] dark:outline dark:outline-2 dark:outline-[#23272f] dark:[box-shadow:0_0_24px_4px_rgba(35,39,47,0.7)]">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Report #{report.id}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Serial: {report.serial_number}</p>
                    </div>
                    {getStatusBadge(report)}
                  </div>
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Problem Description</p>
                    <p className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-[#18181b] p-3 rounded-lg">{report.problem_description}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-gray-700 dark:text-gray-200">Date Submitted</p>
                      <p className="text-gray-900 dark:text-white">{formatDate(report.date_given)}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700 dark:text-gray-200">Status</p>
                      <p className="text-gray-900 dark:text-white">{report.status}</p>
                    </div>
                  </div>
                  {/* Feedback/Suggestion Section */}
                  <div className="mt-4">
                    <button
                      className="flex items-center text-blue-600 hover:underline text-sm mb-2"
                      onClick={() => setSelectedReportId(report.id)}
                    >
                      <MessageCircle className="h-4 w-4 mr-1" /> Suggest a Change / Feedback
                    </button>
                    {selectedReportId === report.id && (
                      <div className="bg-gray-50 dark:bg-[#18181b] p-3 rounded-lg">
                        <textarea
                          className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-2 py-1 mb-2 bg-white dark:bg-[#23272f] text-gray-900 dark:text-white"
                          rows={2}
                          value={feedback}
                          onChange={e => setFeedback(e.target.value)}
                          placeholder="Enter your suggestion or feedback..."
                        />
                        <button
                          className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm"
                          disabled={feedbackLoading}
                          onClick={() => {
                            setFeedbackLoading(true);
                            setTimeout(() => {
                              setFeedback('');
                              setSelectedReportId(null);
                              setFeedbackLoading(false);
                              toast.success('Feedback submitted! (Not yet saved)');
                            }, 1000);
                          }}
                        >
                          {feedbackLoading ? 'Submitting...' : 'Submit'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-[#18181b] rounded-lg shadow-md p-8 text-center outline outline-2 outline-[#e0e7ef] [box-shadow:0_0_48px_12px_rgba(80,120,255,0.18)] dark:outline dark:outline-2 dark:outline-[#23272f] dark:[box-shadow:0_0_24px_4px_rgba(35,39,47,0.7)]">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Reports Found</h3>
              <p className="text-gray-600 dark:text-gray-300">You haven't submitted any reports yet.</p>
              <p className="text-red-600 dark:text-red-400 mt-2">If your report is not listed here, it may have been closed, deleted, or rejected by the owner.</p>
            </div>
          )}
        </div>
      )}
    </main>
    {/* Bottom Navigation with Dark Mode Toggle */}
    <ClientFooter
      activeTab={activeTab}
      onTabChange={setActiveTab}
    />
  </div>
  );
}

export default ClientDashboard;
