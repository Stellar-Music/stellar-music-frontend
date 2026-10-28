import React, { useState } from 'react';
import { Sparkles, X, ArrowRight } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

export interface DemoModeBannerProps {
  onTourOpen?: () => void;
}

export const DemoModeBanner: React.FC<DemoModeBannerProps> = ({ onTourOpen }) => {
  const { isConnected, walletType, connectDemoKeypair } = useWallet();
  const [dismissed, setDismissed] = useState<boolean>(() => {
    return sessionStorage.getItem('stellar_music_demo_banner_dismissed') === 'true';
  });

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('stellar_music_demo_banner_dismissed', 'true');
  };

  const handleActivateDemo = async () => {
    try {
      await connectDemoKeypair();
    } catch {
      // fallback handled in wallet context
    }
  };

  // If already connected with Freighter, or dismissed, don't show
  if (dismissed || (isConnected && walletType === 'freighter')) {
    return null;
  }

  const isDemoActive = isConnected && walletType === 'keypair';

  return (
    <div
      style={{
        width: '100%',
        backgroundColor: isDemoActive
          ? 'rgba(16, 185, 129, 0.12)'
          : 'rgba(0, 242, 254, 0.12)',
        borderBottom: isDemoActive
          ? '1px solid rgba(16, 185, 129, 0.3)'
          : '1px solid rgba(0, 242, 254, 0.25)',
        backdropFilter: 'blur(8px)',
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.82rem',
        color: 'var(--text-primary)',
        zIndex: 40,
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <span
          className="badge"
          style={{
            backgroundColor: isDemoActive ? 'var(--accent-emerald)' : 'var(--accent-cyan)',
            color: '#070913',
            fontSize: '0.68rem',
            padding: '2px 6px',
            borderRadius: '4px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          {isDemoActive ? 'Demo Active' : 'Evaluator Quick-Start'}
        </span>

        <span style={{ color: 'var(--text-secondary)' }}>
          {isDemoActive
            ? 'Judge Demo Mode is active with pre-funded Testnet XLM. You can stream tracks, buy passes, and test smart contract splits.'
            : 'Evaluating without the Freighter extension installed? Activate Judge Demo Mode for instant one-click testing.'}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {!isDemoActive && (
          <button
            onClick={handleActivateDemo}
            className="btn btn-primary btn-sm"
            style={{
              padding: '3px 12px',
              fontSize: '0.75rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Sparkles size={13} />
            <span>Activate Demo Mode</span>
          </button>
        )}

        {onTourOpen && (
          <button
            onClick={onTourOpen}
            className="btn btn-secondary btn-sm"
            style={{
              padding: '3px 10px',
              fontSize: '0.75rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>Quick Tour</span>
            <ArrowRight size={12} />
          </button>
        )}

        <button
          onClick={handleDismiss}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '2px',
            display: 'flex',
            alignItems: 'center',
          }}
          aria-label="Dismiss evaluation banner"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
};
