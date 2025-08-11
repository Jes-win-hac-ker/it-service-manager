import React from 'react';
import './LoadingScreen.css';

const LoadingScreen: React.FC = () => {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="computer-container">
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
          </svg>
          <div className="screen-text">
            <span className="typing-effect">IT Service Manager</span>
            <span className="cursor">_</span>
          </div>
        </div>
        <p className="loading-subtitle">Loading your workspace...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
