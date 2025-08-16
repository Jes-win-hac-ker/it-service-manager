import { createClient } from '@supabase/supabase-js';
import { Report, ReportFormData } from '../types/Report';

// Define types for Purchase data as well
// NOTE: You may need to create a Purchase.ts type definition file for this
interface Purchase {
  id: string;
  created_at: string;
  invoice_number: string;
  product_name: string;
  product_serial_number: string;
  shop_name: string;
  purchase_date: string;
  customer_name: string;
}
type PurchaseFormData = Omit<Purchase, 'id' | 'created_at'>;


// Supabase client setup
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

class SupabaseApiService {
  // --- REPORT FUNCTIONS ---
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

  async getReportById(id: string): Promise<Report> {
    const { data, error } = await supabase.from('reports').select('*').eq('id', id).single();
    if (error) {
      console.error('Error fetching report:', error);
      throw error;
    }
    return data;
  }

  async createReport(reportData: ReportFormData): Promise<{ id: string; message: string }> {
    const { data, error } = await supabase.from('reports').insert([reportData]).select('id').single();
    if (error) {
      console.error('Error creating report:', error);
      throw error;
    }
    return { id: data.id, message: 'Report created successfully' };
  }

  async updateReport(id: string, reportData: ReportFormData): Promise<{ message: string }> {
    const { error } = await supabase.from('reports').update(reportData).eq('id', id);
    if (error) {
      console.error('Error updating report:', error);
      throw error;
    }
    return { message: 'Report updated successfully' };
  }

  async deleteReport(id: string): Promise<{ message: string }> {
    const { error } = await supabase.from('reports').delete().eq('id', id);
    if (error) {
      console.error('Error deleting report:', error);
      throw error;
    }
    return { message: 'Report deleted successfully' };
  }

  // --- DATA MANAGEMENT FUNCTIONS ---
  async exportData(): Promise<string> {
    const { data, error } = await supabase.from('reports').select('*');
    if (error) {
        console.error('Error exporting data:', error);
        throw error;
    }
    return JSON.stringify(data, null, 2);
  }

  async importData(jsonData: string): Promise<void> {
    try {
      const reports: Report[] = JSON.parse(jsonData);
      if (!Array.isArray(reports)) {
        throw new Error('Invalid data format: JSON must be an array.');
      }
      const cleanReports = reports.map(({ id, created_at, ...report }) => report);
      const { error } = await supabase.from('reports').insert(cleanReports);
      if (error) throw error;
    } catch (error) {
      console.error('Error importing data:', error);
      throw new Error('Failed to import data.');
    }
  }

  // --- PURCHASE FUNCTIONS ---
  async getPurchases(): Promise<Purchase[]> {
    const { da
