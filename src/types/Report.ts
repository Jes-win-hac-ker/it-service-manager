export interface Report {
  id: string;
  created_at: string;
  serial_number: string;
  customer_name: string;
  customer_email: string;
  phone_number: string;
  problem_description: string;
  date_given: string;
  status: string; 
  // Optional fields for parts and invoice
  invoice_number?: string;
  part_name?: string;
  shop_name?: string;
  part_number?:string;
}

export type ReportFormData = Omit<Report, 'id' | 'created_at'>;
