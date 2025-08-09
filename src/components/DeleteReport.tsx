import React, { useState, useEffect } from 'react';
import { Trash2, Search, AlertTriangle, User, Phone, Hash } from 'lucide-react';
import { getReports, deleteReport } from '../services/api';
import { Report } from '../types/Report';
import toast from 'react-hot-toast';

const DeleteReport: React.FC = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

    const fetchReports = async () => {
        const data = await getReports();
        setReports(data);
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleDelete = async () => {
        if (!selectedReportId) return;
        
        try {
            await deleteReport(selectedReportId);
            toast.success("Report deleted successfully!");
            fetchReports(); // Refresh the list
            setSelectedReportId(null);
        } catch (error) {
            toast.error("Failed to delete report");
        }
    };
    
    return (
        <div>
            {/* Delete component JSX goes here, using the state and functions above */}
        </div>
    )
}

export default DeleteReport;
