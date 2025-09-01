import React from 'react';
import { FileText, LogOut, User, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AdminHeader: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
  <header className="bg-white dark:bg-[#454545] shadow-lg border-b border-gray-200 dark:border-gray-700 outline outline-2 outline-[#e0e7ef] [box-shadow:0_0_16px_2px_rgba(224,231,239,0.5)] dark:outline dark:outline-2 dark:outline-[#23272f] dark:[box-shadow:0_0_16px_2px_rgba(35,39,47,0.7)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <FileText className="h-8 w-8 text-blue-600 dark:text-blue-300" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">IT Service Manager</h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
              <Shield className="h-3 w-3 mr-1" />
              Admin
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-200">
              <User className="h-4 w-4" />
              <span>{user?.email}</span>
            </div>
            <button
              onClick={signOut}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
