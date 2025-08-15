import React, { useState, useEffect, useCallback } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { getReports } from '../services/api'; // Corrected import
import { Report } from '../types/Report';
import toast from 'react-hot-toast';

const REPORTS_PER_PAGE = 15;

const SearchReports: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);

  const fetchReports = useCallback(async (search: string, pageNum: number) => {
    setIsLoading(true);
    try {
      // Correctly call getReports with all parameters
      const data = await getReports(search, pageNum, REPORTS_PER_PAGE);
      setReports(prev => (pageNum === 0 ? data : [...prev, ...data]));
    } catch (error) {
      toast.error("Could not fetch reports.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setPage(0);
      fetchReports(searchTerm, 0);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm, fetchReports]);

  return (
    <div className="max-w-4xl mx-auto">
      {/* ... JSX for the search component ... */}
    </div>
  );
};

export default SearchReports;
