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
  async getAllReports(search?: string, page: number = 0, limit: number = 1000): Promise<Report[]> {
    let query = supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (search) {
      // Added part_number to the search query
      query = query.or(`serial_number.ilike.%${search}%,customer_name.ilike.%${search}%,phone_number.ilike.%${search}%,part_number.ilike.%${search}%`);
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

  // ... rest of the functions (getReportById, createReport, etc.)
}

export const supabaseApiService = new SupabaseApiService();
