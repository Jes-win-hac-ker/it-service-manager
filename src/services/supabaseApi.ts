import { createClient } from '@supabase/supabase-js';
import { Report, ReportFormData } from '../types/Report';

// Supabase client setup
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

class SupabaseApiService {
  // GET all reports with optional search and pagination
  async getAllReports(search?: string, page: number = 0, limit: number = 1000): Promise<Report[]> {
    let query = supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (search) {
      query = query.or(`serial_number.ilike.%${search}%,customer_name.ilike.%${search}%,phone_number.ilike.%${search}%`);
    }

    const from = page * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching reports:', error);
      throw error;
    }
    return data || [];
  }

  // GET a single report by its ID
  async getReportById(id: string): Promise<Report> {
    const { data, error } = await supabase.from('reports').select('*').eq('id', id).single();
    if (error) {
      console.error('Error fetching report:', error);
      throw error;
    }
    return data;
  }

  // CREATE a new report
  async createReport(reportData: ReportFormData): Promise<{ id: string; message: string }> {
    const { data, error } = await supabase.from('reports').insert([reportData]).select('id').single();
    if (error) {
      console.error('Error creating report:', error);
      throw error;
    }
    return { id: data.id, message: 'Report created successfully' };
  }

  // UPDATE a report
  async updateReport(id: string, reportData: ReportFormData): Promise<{ message: string }> {
    const { error } = await supabase.from('reports').update(reportData).eq('id', id);
    if (error) {
      console.error('Error updating report:', error);
      throw error;
    }
    return { message: 'Report updated successfully' };
  }

  // DELETE a report
  async deleteReport(id: string): Promise<{ message: string }> {
    const { error } = await supabase.from('reports').delete().eq('id', id);
    if (error) {
      console.error('Error deleting report:', error);
      throw error;
    }
    return { message: 'Report deleted successfully' };
  }

  // --- DATA MANAGEMENT FUNCTIONS ---

  // EXPORT all data
  async exportData(): Promise<string> {
    const reports = await this.getAllReports(); // Fetches all reports
    return JSON.stringify(reports, null, 2);
  }

  // IMPORT data from JSON
  async importData(jsonData: string): Promise<void> {
    try {
      const reports: Report[] = JSON.parse(jsonData);
      if (!Array.isArray(reports)) {
        throw new Error('Invalid data format: JSON must be an array.');
      }

      // Remove id and created_at so the database generates new ones
      const cleanReports = reports.map(({ id, created_at, ...report }) => report);

      const { error } = await supabase.from('reports').insert(cleanReports);
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error importing data:', error);
      throw new Error('Failed to import data: Invalid JSON format or database error.');
    }
  }

  // CLEAR all data from the table
  async clearAllData(): Promise<void> {
    const { error } = await supabase.from('reports').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Deletes all records
    if (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  }
}

export const supabaseApiService = new SupabaseApiService();
