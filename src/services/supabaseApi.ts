import { createClient } from '@supabase/supabase-js';
import { Report, ReportFormData } from '../types/Report';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables.');
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
      throw error; // Re-throw the original error
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
      throw error; // Re-throw the original error
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
      throw error; // ✅ THIS IS THE IMPORTANT CHANGE
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
      throw error; // Re-throw the original error
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
      throw error; // Re-throw the original error
    }

    return { message: 'Report deleted successfully' };
  }
}

export const supabaseApiService = new SupabaseApiService();
