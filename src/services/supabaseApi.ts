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
  },

  // ✅ Export all reports as JSON string
  async exportData() {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return JSON.stringify(data, null, 2);
  },

  // ✅ Import reports from JSON string
  async importData(jsonString: string) {
    let parsedData;
    try {
      parsedData = JSON.parse(jsonString);
    } catch {
      throw new Error('Invalid JSON format');
    }
    if (!Array.isArray(parsedData)) {
      throw new Error('Imported data must be an array');
    }
    const { error } = await supabase
      .from('reports')
      .insert(parsedData);
    if (error) throw error;
    return { success: true };
  }
};
