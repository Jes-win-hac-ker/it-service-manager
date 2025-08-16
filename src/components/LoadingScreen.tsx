import React from 'react';
import './LoadingScreen.css';

// The component now accepts an `isFading` prop
const LoadingScreen: React.FC<{ isFading: boolean }> = ({ isFading }) => {
  return (
    // Conditionally apply the 'fade-out' class
    <div className={`loading-screen ${isFading ? 'fade-out' : ''}`}>
      <div className="loading-content">
        <svg
          className="animated-logo"
          width="100"
          height="100"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" className="paper-outline" />
          <polyline points="14 2 14 8 20 8" className="paper-fold" />
          <line x1="16" y1="13" x2="8" y2="13" className="line-1" />
          <line x1="16" y1="17" x2="8" y2="17" className="line-2" />
          <line x1="10" y1="9" x2="8" y2="9" className="line-3" />
        </svg>
        <h1 className="loading-title">IT Service Manager</h1>
        <p className="loading-subtitle">Loading your workspace...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
