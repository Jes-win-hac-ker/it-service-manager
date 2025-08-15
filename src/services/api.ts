import { supabaseApiService } from './supabaseApi';
import { Report, ReportFormData } from '../types/Report';

// GET all reports, with pagination parameters
export const getReports = async (search?: string, page?: number, limit?: number): Promise<Report[]> => {
  return supabaseApiService.getAllReports(search, page, limit);
};

// GET a single report by its ID
export const getReportById = async (id: string): Promise<Report> => {
  return supabaseApiService.getReportById(id);
};

// CREATE a new report
export const addReport = async (reportData: ReportFormData): Promise<{ id: string; message: string }> => {
  return supabaseApiService.createReport(reportData);
};

// UPDATE a report by its ID
export const updateReport = async (id: string, reportData: ReportFormData): Promise<{ message: string }> => {
  return supabaseApiService.updateReport(id, reportData);
};

// DELETE a report by its ID
export const deleteReport = async (id: string): Promise<{ message: string }> => {
  return supabaseApiService.deleteReport(id);
};
