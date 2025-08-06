// src/services/api.ts
import { supabase } from './supabaseApi.ts';

// Note: You may need to update your Report type in 'src/types/Report.ts'
// to match your new table structure.
import { Report } from '../types/Report'; 

// A type for creating a new report, without the DB-generated fields
type NewReportData = Omit<Report, 'id' | 'created_at'>;

// GET all reports
export const getReports = async (): Promise<Report[]> => {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reports:', error);
    return [];
  }
  return data;
};

// CREATE a new report
export const addReport = async (reportData: NewReportData): Promise<Report | null> => {
  const { data, error } = await supabase
    .from('reports')
    .insert([reportData])
    .select(); // .select() returns the newly created row

  if (error) {
    console.error('Error adding report:', error);
    return null;
  }
  return data ? data[0] : null;
};

// DELETE a report by its ID
export const deleteReport = async (id: number): Promise<void> => {
    const { error } = await supabase
        .from('reports')
        .delete()
        .eq('id', id);
    
    if (error) {
        console.error('Error deleting report:', error)
    }
}
