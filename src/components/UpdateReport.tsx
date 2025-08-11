import React, { useState } from 'react';
import { Edit, Save, Search, User, Phone, Hash, Loader2, ChevronLeft, Zap } from 'lucide-react';
import { getReports, updateReport } from '../services/api';
import { Report, ReportFormData } from '../types/Report';
import toast from 'react-hot-toast';
import { format, isValid } from 'date-fns';

const UpdateReport: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Report[]>([]);
  const [currentReport, setCurrentReport] = useState<Report | null>(null);
  const [formData, setFormData] = useState<ReportFormData | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const statusOptions = [
    'Pending Diagnosis',
    'Diagnosed - Awaiting Approval',
    'Awaiting Parts',
    'Repair in Progress',
    'Ready for Pickup',
    'Returned to Customer'
  ];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      toast.error('Please enter a search term.');
      return;
    }
    setIsSearching(true);
    setCurrentReport(null);
    setFormData(null);
    setSearchResults([]);
    try {
      const results = await getReports(searchTerm);
      if (results.length === 0) {
        toast.error("No reports found.");
      } else if (results.length === 1) {
        selectReportForEditing(results[0]);
      } else {
        setSearchResults(results);
      }
    } catch (error) {
      toast.error("Failed to search for reports.");
    } finally {
      setIsSearching(false);
    }
  };

  const selectReportForEditing = (report: Report) => {
    setCurrentReport(report);
    const formattedDate = isValid(new Date(report.date_given)) 
      ? format(new Date(report.date_given), 'yyyy-MM-dd') 
      : '';
    setFormData({
      serial_number: report.serial_number,
      customer_name: report.customer_name,
      phone_number: report.phone_number,
      problem_description: report.problem_description,
      date_given: formattedDate,
      status: report.status || 'Pending Diagnosis',
    });
    setSearchResults([]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!formData) return;
    const { name, value } = e.target;
    setFormData(prev => (prev ? { ...prev, [name]: value } : null));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData || !currentReport) return;
    
    setIsUpdating(true);
    try {
      await updateReport(currentReport.id, formData);
      toast.success("Report updated successfully!");
    } catch (error) {
      toast.error("Failed to update report.");
    } finally {
      se
