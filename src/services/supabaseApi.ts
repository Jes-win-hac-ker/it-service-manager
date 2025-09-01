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
  // Fetch a single report by ID (from reports)
  async getReportById(id: string): Promise<Report> {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !data) {
      throw new Error('Report not found.');
    }
    return data;
  }

  // Update a report by ID (in reports)
  async updateReport(id: string, reportData: ReportFormData): Promise<{ message: string }> {
    const { error } = await supabase
      .from('reports')
      .update({ ...reportData })
      .eq('id', id);
    if (error) {
      throw error;
    }
    return { message: 'Report updated.' };
  }

  // Delete a report by ID (from reports)
  async deleteReport(id: string): Promise<{ message: string }> {
    const { error } = await supabase
      .from('reports')
      .delete()
      .eq('id', id);
    if (error) {
      throw error;
    }
    return { message: 'Report deleted.' };
  }
  async getAllReports(search?: string, page: number = 0, limit: number = 1000): Promise<Report[]> {
    let query = supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (search) {
      // Updated the search query to include status, part_name, and part_number
      query = query.or(`serial_number.ilike.%${search}%,customer_name.ilike.%${search}%,phone_number.ilike.%${search}%,part_number.ilike.%${search}%,part_name.ilike.%${search}%,status.ilike.%${search}%`);
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

  // Fetch all pending reports
  async getAllPendingReports(page: number = 0, limit: number = 1000): Promise<Report[]> {
    let query = supabase
      .from('Pending_reports')
      .select('*')
      .order('created_at', { ascending: false });
    const from = page * limit;
    const to = from + limit - 1;
    query = query.range(from, to);
    const { data, error } = await query;
    if (error) {
      console.error('Error fetching pending reports:', error);
      throw error;
    }
    return data || [];
  }

  // Insert a new report into Pending_reports
  async createPendingReport(reportData: ReportFormData): Promise<{ id: string; message: string }> {
    const { data, error } = await supabase
      .from('Pending_reports')
      .insert([{ ...reportData }])
      .select('id')
      .single();
    if (error) {
      console.error('Error creating pending report:', error);
      throw error;
    }
    return { id: data.id, message: 'Report submitted for review.' };
  }

  // Approve a pending report: move to reports and delete from Pending_reports
  async approvePendingReport(id: string): Promise<{ message: string }> {
    // Fetch the pending report
    const { data, error } = await supabase
      .from('Pending_reports')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !data) {
      throw new Error('Pending report not found.');
    }
    // Remove id field to let Supabase generate a new UUID
    const { id: _pendingId, ...rest } = data;
    console.log('Payload being sent to reports:', rest);
    // Insert into reports
    const { error: insertError } = await supabase
      .from('reports')
      .insert([rest]);
    if (insertError) {
      throw insertError;
    }
    // Delete from Pending_reports
    const { error: deleteError } = await supabase
      .from('Pending_reports')
      .delete()
      .eq('id', id);
    if (deleteError) {
      throw deleteError;
    }
    return { message: 'Report approved and moved to reports.' };
  }

  // Reject a pending report: delete from Pending_reports
  async rejectPendingReport(id: string): Promise<{ message: string }> {
    const { error } = await supabase
      .from('Pending_reports')
      .delete()
      .eq('id', id);
    if (error) {
      throw error;
    }
    return { message: 'Report rejected and deleted.' };
  }

  // Export all reports as JSON
  async exportData(): Promise<string> {
    const { data, error } = await supabase
      .from('reports')
      .select('*');
    if (error) {
      throw error;
    }
    return JSON.stringify(data || [], null, 2);
  }

  // Import reports from JSON
  async importData(jsonData: string): Promise<void> {
    let reports;
    try {
      reports = JSON.parse(jsonData);
    } catch (e) {
      throw new Error('Invalid JSON data');
    }
    if (!Array.isArray(reports)) throw new Error('Data must be an array');
    // Optionally, validate each report object here
    const { error } = await supabase
      .from('reports')
      .insert(reports);
    if (error) {
      throw error;
    }
  }

  // Get all purchases (stub)
  async getPurchases(): Promise<any[]> {
    const { data, error } = await supabase
      .from('purchases')
      .select('*');
    if (error) {
      throw error;
    }
    return data || [];
  }

  // Add a new purchase (stub)
  async addPurchase(purchase: any): Promise<{ id: string }> {
    const { data, error } = await supabase
      .from('purchases')
      .insert([purchase])
      .select('id')
      .single();
    if (error) {
      throw error;
    }
    return { id: data.id };
  }
}

export const supabaseApiService = new SupabaseApiService();
