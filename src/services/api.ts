import { supabaseApiService } from './supabaseApi';
import { Report, ReportFormData } from '../types/Report';

export const getReports = (search?: string, page?: number, limit?: number): Promise<Report[]> => {
  return supabaseApiService.getAllReports(search, page, limit);
};

export const getReportById = (id: string): Promise<Report> => {
  return supabaseApiService.getReportById(id);
};

export const addReport = (reportData: ReportFormData): Promise<{ id: string; message: string }> => {
  return supabaseApiService.createReport(reportData);
};

export const updateReport = (id: string, reportData: ReportFormData): Promise<{ message: string }> => {
  return supabaseApiService.updateReport(id, reportData);
};

export const deleteReport = (id: string): Promise<{ message: string }> => {
  return supabaseApiService.deleteReport(id);
};
