import { createClient } from '@supabase/supabase-js';

// Environment variables for Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Type for purchases based on your PurchaseManager form
export interface PurchaseFormData {
  invoice_number: string;
  product_name: string;
  product_serial_number: string;
  shop_name: string;
  purchase_date: string; // ISO date string
  customer_name: string;
}

export const supabaseApiService = {
  // Add purchase
  async addPurchase(purchaseData: PurchaseFormData) {
    const { data, error } = await supabase
      .from('purchases')
      .insert([purchaseData]);

    if (error) throw error;
    return data;
  },

  // Fetch all purchases
  async getPurchases() {
    const { data, error } = await supabase
      .from('purchases')
      .select('*')
      .order('purchase_date', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Delete purchase by ID
  async deletePurchase(id: number) {
    const { data, error } = await supabase
      .from('purchases')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return data;
  }
};
