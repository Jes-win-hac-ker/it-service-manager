import { supabaseApiService } from './supabaseApi';
import { Report, ReportFormData } from '../types/Report';

export const getReports = (search?: string, page?: number, limit?: number): Promise<Report[]> => {
  return supabaseApiService.getAllReports(search, page, limit);
};

export const getReportById = (id: string): Promise<Report> => {
  return supabaseApiService.getReportById(id);
};

// Add a new report to Pending_reports (for review)
export const addPendingReport = (reportData: ReportFormData): Promise<{ id: string; message: string }> => {
  return supabaseApiService.createPendingReport(reportData);
};

// Fetch all pending reports
export const getPendingReports = (page?: number, limit?: number): Promise<Report[]> => {
  return supabaseApiService.getAllPendingReports(page, limit);
};

// Approve a pending report (move to reports)
export const approvePendingReport = (id: string): Promise<{ message: string }> => {
  return supabaseApiService.approvePendingReport(id);
};

// Reject a pending report (delete from Pending_reports)
export const rejectPendingReport = (id: string): Promise<{ message: string }> => {
  return supabaseApiService.rejectPendingReport(id);
};

export const updateReport = (id: string, reportData: ReportFormData): Promise<{ message: string }> => {
  return supabaseApiService.updateReport(id, reportData);
};

export const deleteReport = (id: string): Promise<{ message: string }> => {
  return supabaseApiService.deleteReport(id);
};
