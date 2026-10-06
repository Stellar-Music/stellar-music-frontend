import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { Disc, Wallet, PlusCircle, ExternalLink, RefreshCw, Sparkles, LogOut } from 'lucide-react';

interface NavbarProps {
  onOpenPublish: () => void;
  onOpenWallet: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenPublish, onOpenWallet }) => {
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

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={onOpenPublish}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <PlusCircle size={16} color="var(--accent-cyan)" />
            <span>Publish Track</span>
          </button>

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
