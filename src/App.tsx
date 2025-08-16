import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header'; // Import new Header
import BottomNav from './components/BottomNav'; // Import new BottomNav
import SubmitReport from './components/SubmitReport';
import SearchReports from './components/SearchReports';
import DataManagement from './components/DataManagement';
import LoadingScreen from './components/LoadingScreen';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  const [activeTab, setActiveTab] = useState('submit');
  const [isLoading, setIsLoading] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setIsFading(true), 4500);
    const unmountTimer = setTimeout(() => setIsLoading(false), 5000);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(unmountTimer);
    };
  }, []);

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'submit':
        return <SubmitReport />;
      case 'search':
        return <SearchReports />;
      case 'data':
        return <DataManagement />;
      default:
        return <SubmitReport />;
    }
  };

  if (isLoading) {
    return <LoadingScreen isFading={isFading} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="py-8 px-4 sm:px-6 lg:px-8 pb-24"> {/* Added bottom padding */}
        <div className="max-w-7xl mx-auto">
          {renderActiveComponent()}
        </div>
      </main>
      
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      
      <Toaster position="top-right" />
    </div>
  );
}

const AppWrapper = () => (
  <ThemeProvider>
    <App />
  </ThemeProvider>
);

export default AppWrapper;
