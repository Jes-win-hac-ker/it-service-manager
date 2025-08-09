import React, { useState, useEffect, useCallback } from 'react';
import { Search, Calendar, Phone, User, Hash } from 'lucide-react';
import { getReports } from '../services/api';
import { Report } from '../types/Report';
import { format } from 'date-fns';

const SearchReports: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [reports, setReports] = useState<Report[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchReports = useCallback(async (search: string) => {
        setIsLoading(true);
        try {
            const data = await getReports(search);
            setReports(data);
        } catch (error) {
            console.error("Failed to fetch reports", error);
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
        <div>
            {/* Search Form component JSX goes here, using the state and functions above */}
        </div>
    )
}

export default SearchReports;
