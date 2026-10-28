import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  const [isOffline, setIsOffline] = useState(typeof navigator !== 'undefined' ? !navigator.onLine : false);
  const [justRestored, setJustRestored] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setJustRestored(true);
      const timer = setTimeout(() => setJustRestored(false), 3500);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setJustRestored(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline && !justRestored) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: isOffline ? '#881337' : '#065f46',
        color: '#ffffff',
        borderBottom: `1px solid ${isOffline ? '#f43f5e' : '#10b981'}`,
        padding: '8px 16px',
        fontSize: '0.82rem',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.4)',
        transition: 'background-color 0.3s ease',
      }}
    >
      {isOffline ? (
        <>
          <WifiOff size={16} color="#fda4af" />
          <span>You are currently offline. Audio streaming and Stellar blockchain transactions are paused until connection resumes.</span>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#ffffff',
              borderRadius: '4px',
              padding: '2px 8px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.74rem',
            }}
          >
            <RefreshCw size={12} />
            <span>Retry</span>
          </button>
        </>
      ) : (
        <>
          <Wifi size={16} color="#a7f3d0" />
          <span>Internet connection restored. Live Stellar Horizon streaming is active.</span>
        </>
      )}
    </div>
  );
};
