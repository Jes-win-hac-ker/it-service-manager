import React, { useState, useEffect, useCallback } from 'react';
import { Search, Calendar, Phone, User, Hash } from 'lucide-react';
import { getReports } from './services/api';
import { Report } from '../types/Report';
import { format } from 'date-fns';

const SearchReports: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReports = useCallback(async (search: string) => {
    setIsLoading(true);
    try {
      const data = await getReports(search);
      setReports(data);
    } catch (error) {
      console.error("Failed to fetch reports", error);
      setReports([]); // Clear reports on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports(''); // Initial fetch for all reports
  }, [fetchReports]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReports(searchTerm);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Search className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Search Reports</h2>
        </div>

        <form onSubmit={handleSearch} className="flex gap-4 mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Search by Serial #, Name, or Phone..."
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            <span>Search</span>
          </button>
        </form>

        <div className="space-y-4">
          {isLoading ? (
            <p className="text-center text-gray-500">Loading reports...</p>
          ) : reports.length > 0 ? (
            reports.map((report) => (
              <div key={report.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-lg text-gray-800 flex items-center">
                      <User className="h-4 w-4 mr-2" /> {report.customer_name}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <Hash className="h-4 w-4 mr-2" /> {report.serial_number}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Given: {format(new Date(report.date_given), 'PPP')}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <Phone className="h-4 w-4 mr-2" /> {report.phone_number}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-gray-700">{report.problem_description}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No reports found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchReports;
