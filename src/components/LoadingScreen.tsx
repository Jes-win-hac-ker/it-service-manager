import React from 'react';
import './LoadingScreen.css';

// The component now accepts an `isFading` prop
const LoadingScreen: React.FC<{ isFading: boolean }> = ({ isFading }) => {
  return (
    // Conditionally apply the 'fade-out' class
    <div className={`loading-screen ${isFading ? 'fade-out' : ''}`}>
      <div className="loading-content">
        <svg
          className="computer-logo"
          width="100"
          height="100"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Monitor Outline */}
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" className="monitor-outline" />
          {/* Monitor Stand */}
          <line x1="8" y1="21" x2="16" y2="21" className="stand-base" />
          <line x1="12" y1="17" x2="12" y2="21" className="stand-neck" />
          {/* Animated lines inside the screen */}
          <line x1="6" y1="7" x2="18" y2="7" className="screen-line-1" />
          <line x1="6" y1="10" x2="15" y2="10" className="screen-line-2" />
          <line x1="6" y1="13" x2="17" y2="13" className="screen-line-3" />
        </svg>
        <h1 className="loading-title">IT Service Manager</h1>
        <p className="loading-subtitle">Loading your workspace...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
