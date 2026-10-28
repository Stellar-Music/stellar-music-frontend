import React from 'react';
import {
  X,
  Music2,
  PlayCircle,
  PlusCircle,
  Wallet,
  PieChart,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { truncateAddress } from '../utils/formatters';

export interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: 'catalog' | 'walkthrough';
  onSelectTab: (tab: 'catalog' | 'walkthrough') => void;
  onOpenPublish: () => void;
  onOpenWallet: () => void;
  onOpenSplits: () => void;
  onOpenEarnings: () => void;
  onOpenArtistRevenue: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  onOpenPublish,
  onOpenWallet,
  onOpenSplits,
  onOpenEarnings,
  onOpenArtistRevenue,
}) => {
  const { address, isConnected, balance } = useWallet();

  if (!isOpen) return null;

  const handleNavClick = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 130,
        backgroundColor: 'rgba(5, 7, 15, 0.85)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        justifyContent: 'flex-end',
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          width: '320px',
          maxWidth: '85vw',
          height: '100%',
          backgroundColor: '#0d1122',
          borderLeft: '1px solid var(--border-hover)',
          padding: '24px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          overflowY: 'auto',
          animation: 'slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'var(--gradient-stellar)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                color: '#070913',
              }}
            >
              S
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.02em' }}>Stellar Music</span>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px',
            }}
            aria-label="Close navigation drawer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Connected Wallet Info Badge */}
        {isConnected && address ? (
          <div
            style={{
              backgroundColor: '#121526',
              borderRadius: 'var(--radius-sm)',
              padding: '12px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Connected Account</div>
            <div style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: 'var(--accent-cyan)' }}>
              {truncateAddress(address, 8, 6)}
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-emerald)', marginTop: '4px' }}>
              {parseFloat(balance).toFixed(2)} XLM
            </div>
          </div>
        ) : (
          <button
            onClick={() => handleNavClick(onOpenWallet)}
            className="btn btn-primary"
            style={{ width: '100%', gap: '8px', justifyContent: 'center' }}
          >
            <Wallet size={16} />
            <span>Connect Wallet</span>
          </button>
        )}

        {/* Navigation Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
          <button
            onClick={() => handleNavClick(() => onSelectTab('catalog'))}
            className={`btn ${activeTab === 'catalog' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ width: '100%', justifyContent: 'flex-start', gap: '10px', padding: '10px 14px' }}
          >
            <Music2 size={16} />
            <span>Catalog Discovery</span>
          </button>

          <button
            onClick={() => handleNavClick(() => onSelectTab('walkthrough'))}
            className={`btn ${activeTab === 'walkthrough' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ width: '100%', justifyContent: 'flex-start', gap: '10px', padding: '10px 14px' }}
          >
            <PlayCircle size={16} />
            <span>Tour & Walkthrough</span>
          </button>

          <button
            onClick={() => handleNavClick(onOpenPublish)}
            className="btn btn-secondary"
            style={{ width: '100%', justifyContent: 'flex-start', gap: '10px', padding: '10px 14px' }}
          >
            <PlusCircle size={16} />
            <span>Publish New Track</span>
          </button>

          <button
            onClick={() => handleNavClick(onOpenSplits)}
            className="btn btn-secondary"
            style={{ width: '100%', justifyContent: 'flex-start', gap: '10px', padding: '10px 14px' }}
          >
            <PieChart size={16} />
            <span>Revenue Split Studio</span>
          </button>

          <button
            onClick={() => handleNavClick(onOpenEarnings)}
            className="btn btn-secondary"
            style={{ width: '100%', justifyContent: 'flex-start', gap: '10px', padding: '10px 14px' }}
          >
            <DollarSign size={16} />
            <span>Contributor Earnings</span>
          </button>

          <button
            onClick={() => handleNavClick(onOpenArtistRevenue)}
            className="btn btn-secondary"
            style={{ width: '100%', justifyContent: 'flex-start', gap: '10px', padding: '10px 14px' }}
          >
            <TrendingUp size={16} />
            <span>Artist Revenue Engine</span>
          </button>
        </div>

        {/* Footer info */}
        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          <div>Stellar Music • Testnet Protocol</div>
          <div style={{ opacity: 0.8 }}>Non-Custodial Multi-Party Settlements</div>
        </div>
      </div>
    </div>
  );
};
