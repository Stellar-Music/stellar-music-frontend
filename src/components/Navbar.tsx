import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { Disc, Wallet, PlusCircle, ExternalLink, RefreshCw, Sparkles, LogOut, PlayCircle, Music2 } from 'lucide-react';

interface NavbarProps {
  activeTab?: 'catalog' | 'walkthrough';
  onSelectTab?: (tab: 'catalog' | 'walkthrough') => void;
  onOpenPublish: () => void;
  onOpenWallet: () => void;
  onOpenSplits: () => void;
  onOpenEarnings: () => void;
  onOpenArtistRevenue: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab = 'catalog',
  onSelectTab,
  onOpenPublish,
  onOpenWallet,
  onOpenSplits,
  onOpenEarnings,
  onOpenArtistRevenue,
}) => {
  const { address, balance, isConnected, disconnect, refreshBalance, fundWithFriendbot, isConnecting } = useWallet();
  const [showDropdown, setShowDropdown] = useState(false);

  const truncateAddress = (addr: string) => {
    return `${addr.substring(0, 4)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 40,
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      backgroundColor: 'rgba(7, 9, 19, 0.8)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '16px 32px',
    }}>
      <div style={{
        maxWidth: '1300px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'var(--gradient-stellar)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(0, 242, 254, 0.35)',
          }}>
            <Disc size={24} color="#070913" style={{ animation: 'spin 12s linear infinite' }} />
          </div>
          <div>
            <span style={{
              fontSize: '1.35rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              background: 'var(--gradient-stellar)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Stellar Music
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              <span className="badge badge-testnet" style={{ fontSize: '0.68rem', padding: '2px 7px' }}>
                ● Stellar Testnet
              </span>
            </div>
          </div>
        </div>

        {/* Primary View Navigation Tabs */}
        {onSelectTab && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '4px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-subtle)',
            gap: '4px',
          }}>
            <button
              onClick={() => onSelectTab('catalog')}
              className={`btn btn-sm ${activeTab === 'catalog' ? 'btn-primary' : 'btn-secondary'}`}
              style={{
                borderRadius: 'var(--radius-full)',
                padding: '6px 16px',
                fontSize: '0.84rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                border: activeTab === 'catalog' ? undefined : 'none',
                background: activeTab === 'catalog' ? undefined : 'transparent',
              }}
            >
              <Music2 size={14} />
              <span>Catalog</span>
            </button>

            <button
              onClick={() => onSelectTab('walkthrough')}
              className={`btn btn-sm ${activeTab === 'walkthrough' ? 'btn-primary' : 'btn-secondary'}`}
              id="tab-btn-walkthrough"
              style={{
                borderRadius: 'var(--radius-full)',
                padding: '6px 16px',
                fontSize: '0.84rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                border: activeTab === 'walkthrough' ? undefined : 'none',
                background: activeTab === 'walkthrough' ? undefined : 'transparent',
                color: activeTab === 'walkthrough' ? undefined : 'var(--accent-cyan)',
              }}
            >
              <PlayCircle size={14} />
              <span>Walkthrough Video</span>
            </button>
          </div>
        )}

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={onOpenEarnings}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            title="Contributor royalty earnings and payout receipts"
          >
            <span style={{ color: 'var(--accent-emerald)', fontWeight: 700, fontSize: '0.9rem' }}>$</span>
            <span>Earnings</span>
          </button>

          <button
            onClick={onOpenArtistRevenue}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            title="Artist revenue pools & automated settlements"
          >
            <Sparkles size={15} color="var(--accent-cyan)" />
            <span>Settlement</span>
          </button>

          <button
            onClick={onOpenSplits}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <span>Splits</span>
          </button>

          <button
            onClick={onOpenPublish}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <PlusCircle size={16} color="var(--accent-cyan)" />
            <span>Publish Track</span>
          </button>

          <a
            href="/walkthrough.html"
            className="btn btn-secondary btn-sm"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              borderColor: 'rgba(56, 189, 248, 0.4)',
              background: 'rgba(56, 189, 248, 0.08)',
              color: 'var(--accent-cyan)',
              textDecoration: 'none',
              fontWeight: 600,
            }}
            title="Watch full video walkthrough with voice-over"
          >
            <PlayCircle size={15} color="var(--accent-cyan)" />
            <span>Tour</span>
          </a>

          {!isConnected ? (
            <button
              onClick={onOpenWallet}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Wallet size={18} />
              <span>Connect Wallet</span>
            </button>
          ) : (
            <div style={{ position: 'relative' }}>
              <div
                onClick={() => setShowDropdown(!showDropdown)}
                className="glass-panel"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  cursor: 'pointer',
                  border: '1px solid rgba(0, 242, 254, 0.3)',
                  backgroundColor: 'rgba(14, 18, 34, 0.85)',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Balance</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                    {parseFloat(balance).toFixed(2)} XLM
                  </span>
                </div>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  fontFamily: 'monospace',
                }}>
                  {truncateAddress(address!)}
                </div>
              </div>

              {/* Wallet Dropdown */}
              {showDropdown && (
                <div
                  className="glass-panel"
                  style={{
                    position: 'absolute',
                    top: '115%',
                    right: 0,
                    width: '260px',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-lg)',
                    zIndex: 50,
                    backgroundColor: '#0e1222',
                  }}
                >
                  <div style={{ padding: '6px 8px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '8px' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Connected Address</div>
                    <div style={{ fontSize: '0.8rem', fontFamily: 'monospace', wordBreak: 'break-all', marginTop: '4px' }}>
                      {address}
                    </div>
                  </div>

                  <button
                    onClick={async () => {
                      await fundWithFriendbot();
                      setShowDropdown(false);
                    }}
                    disabled={isConnecting}
                    className="btn btn-secondary btn-sm"
                    style={{ width: '100%', marginBottom: '6px', justifyContent: 'flex-start' }}
                  >
                    <Sparkles size={15} color="var(--accent-amber)" />
                    <span>Get 10,000 Testnet XLM</span>
                  </button>

                  <button
                    onClick={refreshBalance}
                    className="btn btn-secondary btn-sm"
                    style={{ width: '100%', marginBottom: '6px', justifyContent: 'flex-start' }}
                  >
                    <RefreshCw size={15} />
                    <span>Refresh Balance</span>
                  </button>

                  <a
                    href={`https://stellar.expert/explorer/testnet/account/${address}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary btn-sm"
                    style={{ width: '100%', marginBottom: '6px', justifyContent: 'flex-start' }}
                  >
                    <ExternalLink size={15} />
                    <span>View on Stellar Expert</span>
                  </a>

                  <button
                    onClick={() => {
                      disconnect();
                      setShowDropdown(false);
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ width: '100%', justifyContent: 'flex-start', color: 'var(--accent-rose)' }}
                  >
                    <LogOut size={15} />
                    <span>Disconnect Wallet</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
