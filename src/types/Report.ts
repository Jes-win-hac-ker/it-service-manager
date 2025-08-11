export interface Report {
  id: string;
  created_at: string;
  serial_number: string;
  customer_name: string;
  phone_number: string;
  problem_description: string;
  date_given: string;
  status: string; // Add the new status field
}

export type ReportFormData = Omit<Report, 'id' | 'created_at'>;
