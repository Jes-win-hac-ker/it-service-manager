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
  // ... (getAllReports, getReportById, etc. remain the same)

  async createReport(reportData: ReportFormData): Promise<{ id: string; message: string }> {
    // Corrected the insert query to not use .select('id')
    const { data, error } = await supabase
      .from('reports')
      .insert([reportData])
      .select() // Use .select() without arguments to return the inserted row
      .single();

    if (error) {
      console.error('Error creating report:', error.message, error.details);
      throw error; // Re-throw the original Supabase error
    }
    
    if (!data) {
        throw new Error("No data returned after insert.");
    }

    return { id: data.id, message: 'Report created successfully' };
  }

  // ... (updateReport, deleteReport, etc. remain the same)
}

export const supabaseApiService = new SupabaseApiService();
