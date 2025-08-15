import React, { useState } from "react";
import { getReports, deleteReport } from "../services/reportService";
import { Report } from "../types/Report";
import toast from "react-hot-toast";

interface DeleteReportProps {
  searchTerm: string;
  setSearchResults: React.Dispatch<React.SetStateAction<Report[]>>;
}

const DeleteReport: React.FC<DeleteReportProps> = ({ searchTerm, setSearchResults }) => {
  const [isSearching, setIsSearching] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<Report | null>(null);

  const refreshSearch = async () => {
    setIsSearching(true);
    try {
      const results = await getReports(searchTerm);
      setSearchResults(results);
    } catch (error) {
      toast.error("Failed to refresh reports.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleDelete = async () => {
    if (!reportToDelete) return;
    try {
      await deleteReport(reportToDelete.id);
      toast.success("Report deleted successfully!");
      setReportToDelete(null);
      await refreshSearch();
    } catch (error) {
      toast.error("Failed to delete report.");
    }
  };

  return (
    <div>
      {/* Delete confirmation modal */}
      {reportToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-lg font-bold">Confirm Delete</h2>
            <p>Are you sure you want to delete this report?</p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setReportToDelete(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded"
                onClick={handleDelete}
                disabled={isSearching}
              >
                {isSearching ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteReport;
