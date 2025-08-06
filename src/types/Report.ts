export interface Report {
  id?: number;
  serial_number: string;
  customer_name: string;
  phone_number: string;
  problem_description: string;
  date_given: string;
  date_diagnosed?: string;
  date_returned?: string;
  created_at?: string;
}

export interface ReportFormData {
  serial_number: string;
  customer_name: string;
  phone_number: string;
  problem_description: string;
  date_given: string;
  date_diagnosed?: string;
  date_returned?: string;
}
