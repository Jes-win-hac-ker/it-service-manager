import { Report, ReportFormData } from '../types/Report';

const STORAGE_KEY = 'it_service_reports';

class LocalStorageApiService {
  private getReports(): Report[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  }

  private saveReports(reports: Report[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      throw new Error('Failed to save data');
    }
  }

  private generateId(): number {
    const reports = this.getReports();
    return reports.length > 0 ? Math.max(...reports.map(r => r.id || 0)) + 1 : 1;
  }

  async getAllReports(search?: string): Promise<Report[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const reports = this.getReports();
    
    if (!search) {
      return reports.sort((a, b) => (b.id || 0) - (a.id || 0));
    }

    const searchTerm = search.toLowerCase();
    return reports
      .filter(report => 
        (report.serial_number?.toLowerCase().includes(searchTerm)) ||
        (report.customer_name?.toLowerCase().includes(searchTerm)) ||
        (report.phone_number?.toLowerCase().includes(searchTerm))
      )
      .sort((a, b) => (b.id || 0) - (a.id || 0));
  }

  async getReportById(id: number): Promise<Report> {
    await new Promise(resolve => setTimeout(resolve, 50));
    
    const reports = this.getReports();
    const report = reports.find(r => r.id === id);
    
    if (!report) {
      throw new Error('Report not found');
    }
    
    return report;
  }

  async createReport(reportData: ReportFormData): Promise<{ id: number; message: string }> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const reports = this.getReports();
    const newReport: Report = {
      ...reportData,
      id: this.generateId(),
      created_at: new Date().toISOString()
    };
    
    reports.push(newReport);
    this.saveReports(reports);
    
    return { id: newReport.id!, message: 'Report created successfully' };
  }

  async updateReport(id: number, reportData: ReportFormData): Promise<{ message: string }> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const reports = this.getReports();
    const index = reports.findIndex(r => r.id === id);
    
    if (index === -1) {
      throw new Error('Report not found');
    }
    
    reports[index] = { ...reports[index], ...reportData };
    this.saveReports(reports);
    
    return { message: 'Report updated successfully' };
  }

  async deleteReport(id: number): Promise<{ message: string }> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const reports = this.getReports();
    const filteredReports = reports.filter(r => r.id !== id);
    
    if (filteredReports.length === reports.length) {
      throw new Error('Report not found');
    }
    
    this.saveReports(filteredReports);
    
    return { message: 'Report deleted successfully' };
  }

  // Utility methods for data management
  exportData(): string {
    const reports = this.getReports();
    return JSON.stringify(reports, null, 2);
  }

  importData(jsonData: string): void {
    try {
      const reports = JSON.parse(jsonData);
      if (Array.isArray(reports)) {
        this.saveReports(reports);
      } else {
        throw new Error('Invalid data format');
      }
    } catch (error) {
      throw new Error('Failed to import data: Invalid JSON format');
    }
  }

  clearAllData(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export const localStorageApiService = new LocalStorageApiService();
