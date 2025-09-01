import React from 'react';
import { FileText, Search, Database, Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userRole?: string;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, userRole }) => {
  const { theme, toggleTheme } = useTheme();
  // Dynamic tabs based on userRole
  const tabs =
    userRole === 'admin'
      ? [
          { id: 'submit', label: 'Submit', icon: FileText },
          { id: 'search', label: 'Manage', icon: Search },
          { id: 'review', label: 'Review', icon: Database },
        ]
      : [
          { id: 'submit', label: 'Submit', icon: FileText },
          { id: 'search', label: 'Manage', icon: Search },
        ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#18181b] border-t border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center w-full pt-2 pb-1 text-sm font-medium transition-colors ${
                isActive
                  ? 'text-brand-grey dark:text-white'
                  : 'text-gray-500 dark:text-gray-400 hover:text-brand-grey dark:hover:text-white'
              }`}
            >
              <Icon className={`h-6 w-6 mb-1 ${isActive ? 'text-brand-grey dark:text-white' : ''}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
        <button
          onClick={toggleTheme}
          className="flex flex-col items-center justify-center w-full pt-2 pb-1 text-gray-500 dark:text-gray-400 hover:text-brand-grey dark:hover:text-white"
        >
          {theme === 'light' ? <Moon className="h-6 w-6 mb-1" /> : <Sun className="h-6 w-6 mb-1" />}
          <span className="text-sm">{theme === 'light' ? 'Dark' : 'Light'}</span>
        </button>
      </div>
    </nav>
  );
};

export default BottomNav;
