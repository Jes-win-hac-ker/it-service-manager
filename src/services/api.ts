// src/services/api.ts
import { supabaseApiService } from './supabaseApi'; // ✅ Corrected import

// Note: You may need to update your Report type in 'src/types/Report.ts'
// to match your new table structure.
import { Report } from '../types/Report';

// A type for creating a new report, without the DB-generated fields
type NewReportData = Omit<Report, 'id' | 'created_at'>;

// GET all reports
export const getReports = async (): Promise<Report[]> => {
  // Use the imported service
  return supabaseApiService.getAllReports();
};

// CREATE a new report
export const addReport = async (reportData: NewReportData): Promise<{ id: string; message: string } | null> => {
  // Use the imported service
  return supabaseApiService.createReport(reportData);
};

// DELETE a report by its ID
export const deleteReport = async (id: string): Promise<{ message: string }> => {
  // Use the imported service
  return supabaseApiService.deleteReport(id);
};
