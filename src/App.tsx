import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import AdminHeader from './components/AdminHeader'; 
import ClientFooter from './components/ClientFooter';
import AdminFooterNav from './components/AdminFooterNav';
import SubmitReport from './components/SubmitReport';
import SearchReports from './components/SearchReports';
import DataManagement from './components/DataManagement';
import PendingReportsReview from './components/PendingReportsReview';
import LoadingScreen from './components/LoadingScreen';
import LoginPage from './components/LoginPage';
import ClientDashboard from './components/ClientDashboard';
import { useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  const [activeTab, setActiveTab] = useState('submit');
  const [isFading, setIsFading] = useState(false);
  const { isAuthenticated, isLoading, user, signOut } = useAuth();

  // fade effect for loading screen
  useEffect(() => {
    if (isLoading) {
      const fadeTimer = setTimeout(() => setIsFading(true), 4500);
      return () => clearTimeout(fadeTimer);
    }
  }, [isLoading]);

  const renderActiveComponent = () => {
    if (user?.role === 'admin') {
      switch (activeTab) {
        case 'submit':
          return <SubmitReport />;
        case 'search':
          return <SearchReports />;
        case 'data':
          return <DataManagement />;
        case 'review':
          return <PendingReportsReview />;
        default:
          return <SubmitReport />;
      }
    } else {
      switch (activeTab) {
        case 'submit':
          return <SubmitReport />;
        case 'search':
          return <SearchReports />;
        default:
          return <SubmitReport />;
      }
    }
  };

  if (isLoading) {
    return <LoadingScreen isFading={isFading} />;
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Route client users directly to ClientDashboard
  if (user && user.role === 'client') {
    return <ClientDashboard />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#454545]">
      {/* Show AdminHeader for admin, Header for others */}
      {user?.role === 'admin' ? <AdminHeader /> : <Header />}

      <main className="py-8 px-4 sm:px-6 lg:px-8 pb-24">
        <div className="max-w-7xl mx-auto">
          {renderActiveComponent()}
        </div>
      </main>

      {/* Show separate footers for client and admin */}
      {user?.role === 'admin' ? (
        <AdminFooterNav activeTab={activeTab} onTabChange={setActiveTab} />
      ) : (
        <ClientFooter activeTab={activeTab} onTabChange={setActiveTab} />
      )}

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
