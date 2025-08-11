import React, { useState, useEffect, useCallback } from 'react';
import { Search, Calendar, Phone, User, Hash, Loader2 } from 'lucide-react';
import { getReports } from '../services/api';
import { Report } from '../types/Report';
import { format } from 'date-fns';

const REPORTS_PER_PAGE = 15;

const SearchReports: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchReports = useCallback(async (search: string, pageNum: number) => {
    if (pageNum === 0) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }

    try {
      const data = await getReports(search, pageNum, REPORTS_PER_PAGE);
      
      setReports(prev => pageNum === 0 ? data : [...prev, ...data]);
      
      if (data.length < REPORTS_PER_PAGE) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

    } catch (error) {
      console.error("Failed to fetch reports", error);
      setReports([]);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    // This effect will run when the component mounts and when the search term changes.
    // It resets the page and reports, then fetches the first page of results.
    const handler = setTimeout(() => {
      setPage(0);
      setReports([]);
      fetchReports(searchTerm, 0);
    }, 500); // Debounce to avoid API calls on every keystroke

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, fetchReports]);

  const handleSearchFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // The useEffect hook already handles re-fetching when searchTerm changes.
    // This function is just here to prevent the default form submission behavior.
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchReports(searchTerm, nextPage);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Search className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Search Reports</h2>
        </div>

        <form onSubmit={handleSearchFormSubmit} className="flex gap-4 mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Search by Serial #, Name, or Phone..."
          />
        </form>

        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
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
            <p className="text-center text-gray-500 py-10">No reports found.</p>
          )}
        </div>

        {hasMore && !isLoading && (
          <div className="mt-6 text-center">
            <button
              onClick={loadMore}
              disabled={isLoadingMore}
              className="bg-gray-200 text-gray-800 py-2 px-6 rounded-lg hover:bg-gray-300 disabled:opacity-50 flex items-center justify-center mx-auto"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                'Load More'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchReports;
