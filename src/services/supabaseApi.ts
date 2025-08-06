import { createClient } from '@supabase/supabase-js';
import { Report, ReportFormData } from '../types/Report';

// These environment variables will be set when you connect to Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please connect to Supabase first.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

class SupabaseApiService {
  async getAllReports(search?: string): Promise<Report[]> {
    let query = supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (search) {
      query = query.or(`serial_number.ilike.%${search}%,customer_name.ilike.%${search}%,phone_number.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching reports:', error);
      throw new Error('Failed to fetch reports');
    }

    return data || [];
  }

  async getReportById(id: string): Promise<Report> {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching report:', error);
      throw new Error('Report not found');
    }

    return data;
  }

  async createReport(reportData: ReportFormData): Promise<{ id: string; message: string }> {
    const { data, error } = await supabase
      .from('reports')
      .insert([reportData])
      .select('id')
      .single();

    if (error) {
      console.error('Error creating report:', error);
      throw new Error('Failed to create report');
    }

    return { id: data.id, message: 'Report created successfully' };
  }

  async updateReport(id: string, reportData: ReportFormData): Promise<{ message: string }> {
    const { error } = await supabase
      .from('reports')
      .update(reportData)
      .eq('id', id);

    if (error) {
      console.error('Error updating report:', error);
      throw new Error('Failed to update report');
    }

    return { message: 'Report updated successfully' };
  }

  async deleteReport(id: string): Promise<{ message: string }> {
    const { error } = await supabase
      .from('reports')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting report:', error);
      throw new Error('Failed to delete report');
    }

    return { message: 'Report deleted successfully' };
  }

  // Utility methods for data management
  async exportData(): Promise<string> {
    const reports = await this.getAllReports();
    return JSON.stringify(reports, null, 2);
  }

  async importData(jsonData: string): Promise<void> {
    try {
      const reports = JSON.parse(jsonData);
      if (!Array.isArray(reports)) {
        throw new Error('Invalid data format');
      }

      // Remove id and created_at fields to let Supabase generate new ones
      const cleanReports = reports.map(({ id, created_at, ...report }) => report);

      const { error } = await supabase
        .from('reports')
        .insert(cleanReports);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error importing data:', error);
      throw new Error('Failed to import data: Invalid JSON format or database error');
    }
  }

  async clearAllData(): Promise<void> {
    const { error } = await supabase
      .from('reports')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records

    if (error) {
      console.error('Error clearing data:', error);
      throw new Error('Failed to clear data');
    }
  }
}

export const supabaseApiService = new SupabaseApiService();
