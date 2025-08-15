import React, { useState, useEffect, useCallback } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { getReports, deleteReport } from '../services/api'; // Corrected import
import { Report } from '../types/Report';
import toast from 'react-hot-toast';

const DeleteReport: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reportToDelete, setReportToDelete] = useState<Report | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getReports();
      setReports(data);
    } catch (error) {
      toast.error("Could not load reports.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleDelete = async () => {
    if (!reportToDelete) return;

    setIsDeleting(true);
    try {
      await deleteReport(reportToDelete.id);
      toast.success("Report deleted successfully!");
      setReportToDelete(null);
      fetchReports();
    } catch (error) {
      toast.error("Failed to delete report.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* ... JSX for the delete component ... */}
    </div>
  );
};

export default DeleteReport;
