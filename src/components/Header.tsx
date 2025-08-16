import React from 'react';
import { Monitor } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700 h-16 flex items-center px-4 sm:px-6 lg:px-8">
      <div className="flex items-center space-x-2">
        <Monitor className="h-8 w-8 text-brand-grey dark:text-gray-200" />
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">IT Service Manager</h1>
      </div>
    </header>
  );
};

export default Header;
