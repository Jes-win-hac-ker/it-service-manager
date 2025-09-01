import React, { useEffect, useState } from 'react';
import { getPendingReports, approvePendingReport, rejectPendingReport } from '../services/api';
import { Report } from '../types/Report';
import toast from 'react-hot-toast';

const PendingReportsReview: React.FC = () => {
  const [pendingReports, setPendingReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const reports = await getPendingReports();
      setPendingReports(reports);
    } catch (err) {
      toast.error('Failed to fetch pending reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      await approvePendingReport(id);
      toast.success('Report approved!');
      fetchPending();
    } catch (err) {
      toast.error('Failed to approve report');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    setActionLoading(id);
    try {
      await rejectPendingReport(id);
      toast.success('Report rejected!');
      fetchPending();
    } catch (err) {
      toast.error('Failed to reject report');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <div className="text-center py-8">Loading pending reports...</div>;

  if (pendingReports.length === 0) return <div className="text-center py-8">No pending reports.</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Pending Reports for Review</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 rounded shadow">
          <thead>
            <tr>
              <th className="px-2 py-1 text-gray-900 dark:text-gray-100">Customer</th>
              <th className="px-2 py-1 text-gray-900 dark:text-gray-100">Phone</th>
              <th className="px-2 py-1 text-gray-900 dark:text-gray-100">Problem</th>
              <th className="px-2 py-1 text-gray-900 dark:text-gray-100">Date</th>
              <th className="px-2 py-1 text-gray-900 dark:text-gray-100">Status</th>
              <th className="px-2 py-1 text-gray-900 dark:text-gray-100">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingReports.map((report) => (
              <tr key={report.id} className="border-b">
                <td className="px-2 py-1 text-gray-900 dark:text-gray-100">{report.customer_name}</td>
                <td className="px-2 py-1 text-gray-900 dark:text-gray-100">{report.phone_number}</td>
                <td className="px-2 py-1 text-gray-900 dark:text-gray-100">{report.problem_description}</td>
                <td className="px-2 py-1 text-gray-900 dark:text-gray-100">{report.date_given}</td>
                <td className="px-2 py-1 text-gray-900 dark:text-gray-100">{report.status}</td>
                <td className="px-2 py-1 flex gap-2 text-gray-900 dark:text-gray-100">
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded disabled:opacity-50"
                    onClick={() => handleApprove(report.id)}
                    disabled={actionLoading === report.id}
                  >
                    Approve
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded disabled:opacity-50"
                    onClick={() => handleReject(report.id)}
                    disabled={actionLoading === report.id}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingReportsReview;
