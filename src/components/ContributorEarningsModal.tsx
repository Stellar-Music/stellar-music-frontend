import React, { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { api } from '../services/api';
import { ContributorEarningsSummary } from '../types';
import {
  X,
  Coins,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  Wallet,
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface ContributorEarningsModalProps {
  onClose: () => void;
  onOpenTrackRevenue?: (trackId: string) => void;
}

export const ContributorEarningsModal: React.FC<ContributorEarningsModalProps> = ({
  onClose,
  onOpenTrackRevenue,
}) => {
  const { address, isConnected } = useWallet();
  const [earnings, setEarnings] = useState<ContributorEarningsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'tracks' | 'history'>('tracks');
  const [recentSettlements, setRecentSettlements] = useState<any[]>([]);

  const fetchEarnings = async () => {
    if (!address) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await api.getContributorEarnings(address);
      setEarnings(data);

      // Also fetch settlements where this contributor is involved
      const allSettlements = await api.getSettlements();
      const mySettlements = (allSettlements || []).filter((s: any) =>
        s.recipients?.some((r: any) => r.wallet_address === address)
      );
      setRecentSettlements(mySettlements);
    } catch (err: any) {
      console.error('Failed to load contributor earnings:', err);
      setError(err.message || 'Failed to load earnings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, [address]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        backgroundColor: 'rgba(5, 7, 15, 0.85)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '860px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '28px',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: '#0d1122',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
          }}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #10b981 0%, #00f2fe 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Coins size={26} color="#070913" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Contributor Earnings & Royalties</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Automated multi-recipient Stellar settlements backed by locked cryptographic splits
              </p>
            </div>
          </div>
          <button
            onClick={fetchEarnings}
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              fontSize: '0.82rem',
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>

        {!isConnected ? (
          <div
            style={{
              padding: '40px 20px',
              textAlign: 'center',
              borderRadius: 'var(--radius-md)',
              border: '1px dashed var(--border-subtle)',
              background: 'rgba(255, 255, 255, 0.02)',
            }}
          >
            <Wallet size={40} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
            <h3 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>Connect Your Stellar Wallet</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '440px', margin: '0 auto' }}>
              Connect your wallet to inspect your accrued royalties, pending revenue allocations, and on-chain settlement receipts.
            </p>
          </div>
        ) : loading && !earnings ? (
          <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
            <RefreshCw size={32} className="animate-spin" style={{ margin: '0 auto 12px' }} />
            <p>Aggregating blockchain settlement receipts...</p>
          </div>
        ) : error ? (
          <div
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: 'var(--accent-coral)',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        ) : (
          <>
            {/* KPI Summary Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '16px',
                marginBottom: '24px',
              }}
            >
              <div
                style={{
                  padding: '18px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-emerald)', marginBottom: '8px' }}>
                  <CheckCircle2 size={16} />
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase' }}>Settled on Stellar</span>
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>
                  {(earnings?.settled_revenue || 0).toFixed(4)}{' '}
                  <span style={{ fontSize: '1rem', color: 'var(--accent-emerald)' }}>XLM</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Transferred directly to your Stellar account
                </p>
              </div>

              <div
                style={{
                  padding: '18px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(245, 158, 11, 0.08)',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-amber)', marginBottom: '8px' }}>
                  <Clock size={16} />
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase' }}>Pending Settlement</span>
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>
                  {(earnings?.pending_revenue || 0).toFixed(4)}{' '}
                  <span style={{ fontSize: '1rem', color: 'var(--accent-amber)' }}>XLM</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Accrued in revenue pool awaiting batch execution
                </p>
              </div>

              <div
                style={{
                  padding: '18px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(0, 242, 254, 0.08)',
                  border: '1px solid rgba(0, 242, 254, 0.25)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)', marginBottom: '8px' }}>
                  <Sparkles size={16} />
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase' }}>Lifetime Allocated</span>
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>
                  {(earnings?.total_earned || 0).toFixed(4)}{' '}
                  <span style={{ fontSize: '1rem', color: 'var(--accent-cyan)' }}>XLM</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Across {earnings?.tracks.length || 0} active royalty agreements
                </p>
              </div>
            </div>

            {/* Wallet Address Chip */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
                marginBottom: '20px',
                fontSize: '0.82rem',
              }}
            >
              <span style={{ color: 'var(--text-muted)' }}>Connected Recipient Key:</span>
              <span style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                {address}
              </span>
            </div>

            {/* Tabs */}
            <div
              style={{
                display: 'flex',
                gap: '8px',
                borderBottom: '1px solid var(--border-subtle)',
                marginBottom: '16px',
                paddingBottom: '8px',
              }}
            >
              <button
                onClick={() => setActiveTab('tracks')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: activeTab === 'tracks' ? 'rgba(0, 242, 254, 0.15)' : 'transparent',
                  color: activeTab === 'tracks' ? 'var(--accent-cyan)' : 'var(--text-muted)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Track Allocations ({earnings?.tracks.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('history')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: activeTab === 'history' ? 'rgba(0, 242, 254, 0.15)' : 'transparent',
                  color: activeTab === 'history' ? 'var(--accent-cyan)' : 'var(--text-muted)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Settlement Receipts ({recentSettlements.length})
              </button>
            </div>

            {/* Tab 1: Tracks List */}
            {activeTab === 'tracks' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {earnings?.tracks.length === 0 ? (
                  <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '30px 0' }}>
                    No track split agreements found for this wallet address yet.
                  </p>
                ) : (
                  earnings?.tracks.map((t) => (
                    <div
                      key={t.track_id}
                      style={{
                        padding: '14px 16px',
                        borderRadius: 'var(--radius-md)',
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px',
                        transition: 'background 0.2s',
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{t.track_title}</span>
                          <span
                            style={{
                              padding: '2px 8px',
                              borderRadius: '10px',
                              background: 'rgba(79, 172, 254, 0.15)',
                              color: 'var(--accent-cyan)',
                              fontSize: '0.72rem',
                              fontWeight: 600,
                            }}
                          >
                            {t.role}
                          </span>
                          <span
                            style={{
                              padding: '2px 8px',
                              borderRadius: '10px',
                              background: 'rgba(168, 85, 247, 0.15)',
                              color: '#c084fc',
                              fontSize: '0.72rem',
                              fontWeight: 600,
                            }}
                          >
                            {t.percentage}% share
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          <span>
                            Settled: <strong style={{ color: 'var(--accent-emerald)' }}>{t.settled.toFixed(4)} XLM</strong>
                          </span>
                          <span>
                            Pending: <strong style={{ color: 'var(--accent-amber)' }}>{t.pending.toFixed(4)} XLM</strong>
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {t.latest_tx_hash && (
                          <a
                            href={`https://stellar.expert/explorer/testnet/tx/${t.latest_tx_hash}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '0.75rem',
                              color: 'var(--accent-cyan)',
                              textDecoration: 'none',
                              padding: '4px 8px',
                              borderRadius: 'var(--radius-sm)',
                              background: 'rgba(0, 242, 254, 0.08)',
                            }}
                          >
                            <span>Tx</span>
                            <ExternalLink size={12} />
                          </a>
                        )}
                        {onOpenTrackRevenue && (
                          <button
                            onClick={() => {
                              onClose();
                              onOpenTrackRevenue(t.track_id);
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '0.78rem',
                              padding: '6px 12px',
                              borderRadius: 'var(--radius-sm)',
                              background: 'rgba(255, 255, 255, 0.08)',
                              border: 'none',
                              color: 'var(--text-primary)',
                              cursor: 'pointer',
                            }}
                          >
                            <span>Inspect</span>
                            <ArrowUpRight size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab 2: Settlement Receipts */}
            {activeTab === 'history' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {recentSettlements.length === 0 ? (
                  <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '30px 0' }}>
                    No blockchain settlements executed for your account yet.
                  </p>
                ) : (
                  recentSettlements.map((s) => {
                    const recipientData = s.recipients?.find((r: any) => r.wallet_address === address);
                    return (
                      <div
                        key={s.id}
                        style={{
                          padding: '14px 16px',
                          borderRadius: 'var(--radius-md)',
                          background: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid var(--border-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px',
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                              Track: {s.track_id.substring(0, 8)}...
                            </span>
                            <span
                              style={{
                                padding: '2px 8px',
                                borderRadius: '10px',
                                background:
                                  s.status === 'CONFIRMED'
                                    ? 'rgba(16, 185, 129, 0.15)'
                                    : 'rgba(245, 158, 11, 0.15)',
                                color: s.status === 'CONFIRMED' ? 'var(--accent-emerald)' : 'var(--accent-amber)',
                                fontSize: '0.72rem',
                                fontWeight: 600,
                              }}
                            >
                              {s.status}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            {new Date(s.created_at).toLocaleString()} • Agreement v{s.agreement_version}
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 700, color: 'var(--accent-emerald)', fontSize: '1rem' }}>
                            +{recipientData?.actual_amount ? recipientData.actual_amount.toFixed(4) : (0).toFixed(4)} XLM
                          </div>
                          {s.tx_hash ? (
                            <a
                              href={`https://stellar.expert/explorer/testnet/tx/${s.tx_hash}`}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px',
                                fontSize: '0.75rem',
                                color: 'var(--accent-cyan)',
                                textDecoration: 'none',
                                marginTop: '4px',
                              }}
                            >
                              <span>{s.tx_hash.substring(0, 10)}...</span>
                              <ExternalLink size={11} />
                            </a>
                          ) : (
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Processing</span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
