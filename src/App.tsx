import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Navigation from './components/Navigation';
import SubmitReport from './components/SubmitReport';
import SearchReports from './components/SearchReports';
import UpdateReport from './components/UpdateReport';
import DeleteReport from './components/DeleteReport';
import DataManagement from './components/DataManagement';
import LoadingScreen from './components/LoadingScreen'; // Import the new component

function App() {
  const [activeTab, setActiveTab] = useState('submit');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial page load and animation time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Show loader for 3 seconds to allow animation to complete

    return () => clearTimeout(timer); // Cleanup timer
  }, []);

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'submit':
        return <SubmitReport />;
      case 'search':
        return <SearchReports />;
      case 'update':
        return <UpdateReport />;
      case 'delete':
        return <DeleteReport />;
      case 'data':
        return <DataManagement />;
      default:
        return <SubmitReport />;
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {renderActiveComponent()}
        </div>
      </main>
      
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
}

export default App;
