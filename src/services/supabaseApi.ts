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
  // =======================
  // REPORTS
  // =======================
  async getAllReports(search?: string, page = 0, limit = 1000): Promise<Report[]> {
    let query = supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (search) {
      query = query.or(
        `serial_number.ilike.%${search}%,customer_name.ilike.%${search}%,phone_number.ilike.%${search}%`
      );
    }

    const from = page * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async getReportById(id: string): Promise<Report> {
    const { data, error } = await supabase.from('reports').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  }

  async createReport(reportData: ReportFormData) {
    const { data, error } = await supabase.from('reports').insert([reportData]).select('id').single();
    if (error) throw error;
    return { id: data.id, message: 'Report created successfully' };
  }

  async updateReport(id: string, reportData: ReportFormData) {
    const { error } = await supabase.from('reports').update(reportData).eq('id', id);
    if (error) throw error;
    return { message: 'Report updated successfully' };
  }

  async deleteReport(id: string) {
    const { error } = await supabase.from('reports').delete().eq('id', id);
    if (error) throw error;
    return { message: 'Report deleted successfully' };
  }

  async exportData() {
    const reports = await this.getAllReports();
    return JSON.stringify(reports, null, 2);
  }

  async importData(jsonData: string) {
    const reports: Report[] = JSON.parse(jsonData);
    if (!Array.isArray(reports)) throw new Error('Invalid data format');

    const cleanReports = reports.map(({ id, created_at, ...r }) => r);
    const { error } = await supabase.from('reports').insert(cleanReports);
    if (error) throw error;
  }

  async clearAllData() {
    const { error } = await supabase.from('reports').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (error) throw error;
  }

  // =======================
  // PURCHASES
  // =======================
  async getPurchases() {
    const { data, error } = await supabase
      .from('purchases')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async addPurchase(purchase: { item: string; price: number; category?: string }) {
    const { data, error } = await supabase.from('purchases').insert([purchase]).select();
    if (error) throw error;
    return data;
  }
}

export const supabaseApiService = new SupabaseApiService();
