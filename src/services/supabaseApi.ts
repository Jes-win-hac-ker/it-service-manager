import { createClient } from '@supabase/supabase-js';
import { Report, ReportFormData } from '../types/Report';

// Define types for Purchase data as well
interface Purchase {
  id: string;
  created_at: string;
  invoice_number: string;
  product_name: string;
  product_serial_number: string;
  shop_name: string;
  purchase_date: string;
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
  // ... (All your existing report functions remain here)
  async getAllReports(search?: string, page: number = 0, limit: number = 1000): Promise<Report[]> {
    // ... existing code
  }
  async getReportById(id: string): Promise<Report> {
    // ... existing code
  }
  async createReport(reportData: ReportFormData): Promise<{ id: string; message: string }> {
    // ... existing code
  }
  async updateReport(id: string, reportData: ReportFormData): Promise<{ message: string }> {
    // ... existing code
  }
  async deleteReport(id: string): Promise<{ message: string }> {
    // ... existing code
  }
  async exportData(): Promise<string> {
    // ... existing code
  }
  async importData(jsonData: string): Promise<void> {
    // ... existing code
  }
  async clearAllData(): Promise<void> {
    // ... existing code
  }

  // --- NEW PURCHASE MANAGEMENT FUNCTIONS ---

  async getPurchases(): Promise<Purchase[]> {
    const { data, error } = await supabase.from('purchases').select('*').order('purchase_date', { ascending: false });
    if (error) {
      console.error('Error fetching purchases:', error);
      throw error;
    }
    return data || [];
  }

  async addPurchase(purchaseData: PurchaseFormData): Promise<Purchase> {
    const { data, error } = await supabase.from('purchases').insert([purchaseData]).select().single();
    if (error) {
      console.error('Error adding purchase:', error);
      throw error;
    }
    return data;
  }
}

export const supabaseApiService = new SupabaseApiService();
