/*
  # Create reports table for IT Service Manager

  1. New Tables
    - `reports`
      - `id` (uuid, primary key)
      - `serial_number` (text)
      - `customer_name` (text, required)
      - `phone_number` (text, required)
      - `problem_description` (text, required)
      - `date_given` (date, required)
      - `date_diagnosed` (date, optional)
      - `date_returned` (date, optional)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `reports` table
    - Add policies for authenticated users to manage their reports
    - Add policy for anonymous users to manage reports (for demo purposes)
*/

CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  serial_number text DEFAULT '',
  customer_name text NOT NULL,
  phone_number text NOT NULL,
  problem_description text NOT NULL,
  date_given date NOT NULL,
  date_diagnosed date,
  date_returned date,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Allow all operations for authenticated users
CREATE POLICY "Authenticated users can manage reports"
  ON reports
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow all operations for anonymous users (for demo/public access)
CREATE POLICY "Anonymous users can manage reports"
  ON reports
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Create index for better search performance
CREATE INDEX IF NOT EXISTS idx_reports_search 
ON reports (serial_number, customer_name, phone_number);

CREATE INDEX IF NOT EXISTS idx_reports_created_at 
ON reports (created_at DESC);
