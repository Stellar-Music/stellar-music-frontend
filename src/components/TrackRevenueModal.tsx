import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { TrackRevenueData } from '../types';
import {
  X,
  PieChart,
  Lock,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

interface TrackRevenueModalProps {
  trackId: string;
  onClose: () => void;
}

export const TrackRevenueModal: React.FC<TrackRevenueModalProps> = ({ trackId, onClose }) => {
  const [data, setData] = useState<TrackRevenueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSettling, setIsSettling] = useState(false);
  const [settleResult, setSettleResult] = useState<string | null>(null);

  const fetchTrackRevenue = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getTrackRevenue(trackId);
      setData(res);
    } catch (err: any) {
      console.error('Failed to load track revenue:', err);
      setError(err.message || 'Failed to load track revenue data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrackRevenue();
  }, [trackId]);

  const handleSettle = async () => {
    if (!data) return;
    const pendingAmount =
      data.locked_agreement ? Math.max(0, 10 - data.total_settled_xlm) : 0; // or any remaining amount
    setIsSettling(true);
    setSettleResult(null);
    try {
      const res = await api.executeTrackSettlement(trackId, pendingAmount > 0 ? pendingAmount : 5);
      setSettleResult(`Settlement successful! Tx: ${res.settlement.tx_hash}`);
      await fetchTrackRevenue();
    } catch (err: any) {
      setError(err.message || 'Failed to execute settlement');
    } finally {
      setIsSettling(false);
    }
  };

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
          maxWidth: '840px',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #a855f7 0%, #00f2fe 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PieChart size={26} color="#070913" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Track Revenue & Settlement Audit</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              On-chain split verification and automated multi-recipient settlement ledger
            </p>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
            <RefreshCw size={32} className="animate-spin" style={{ margin: '0 auto 12px' }} />
            <p>Auditing track revenue pools and settlement history...</p>
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
        ) : data ? (
          <>
            {settleResult && (
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '16px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: 'var(--accent-emerald)',
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <CheckCircle2 size={16} />
                <span>{settleResult}</span>
              </div>
            )}

            {/* Track Info Banner */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
                marginBottom: '20px',
              }}
            >
              <img
                src={data.track.artwork_reference}
                alt={data.track.title}
                style={{ width: '56px', height: '56px', borderRadius: '10px', objectFit: 'cover' }}
              />
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '2px' }}>{data.track.title}</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Artist: {data.track.artist_name || 'Independent'} • ID: {data.track.id}
                </p>
              </div>

              {data.locked_agreement ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    color: 'var(--accent-emerald)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                  }}
                >
                  <Lock size={14} />
                  <span>Locked Split v{data.locked_agreement.version}</span>
                </div>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: 'var(--accent-coral)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                  }}
                >
                  <AlertCircle size={14} />
                  <span>No Locked Split</span>
                </div>
              )}
            </div>

            {/* KPI Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '14px',
                marginBottom: '20px',
              }}
            >
              <div
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(0, 242, 254, 0.06)',
                  border: '1px solid rgba(0, 242, 254, 0.2)',
                }}
              >
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Total Settled on Stellar
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                  {data.total_settled_xlm.toFixed(4)} <span style={{ fontSize: '0.9rem' }}>XLM</span>
                </div>
              </div>

              <div
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(168, 85, 247, 0.06)',
                  border: '1px solid rgba(168, 85, 247, 0.2)',
                }}
              >
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Settlement Events
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>
                  {data.settlement_count} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>runs</span>
                </div>
              </div>

              <div
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(245, 158, 11, 0.06)',
                  border: '1px solid rgba(245, 158, 11, 0.2)',
                }}
              >
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Active Collaborators
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>
                  {data.contributors.length}{' '}
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>parties</span>
                </div>
              </div>
            </div>

            {/* Split Agreement Breakdown Table */}
            {data.locked_agreement && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Active Split Agreement Allocation</h4>
                  <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Hash: {data.locked_agreement.agreement_hash.substring(0, 16)}...
                  </span>
                </div>

                <div
                  style={{
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                    <thead>
                      <tr style={{ background: 'rgba(255, 255, 255, 0.04)', textAlign: 'left' }}>
                        <th style={{ padding: '10px 14px' }}>Role</th>
                        <th style={{ padding: '10px 14px' }}>Wallet</th>
                        <th style={{ padding: '10px 14px', textAlign: 'right' }}>Percentage</th>
                        <th style={{ padding: '10px 14px', textAlign: 'right' }}>Basis Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.contributors.map((c, idx) => (
                        <tr
                          key={c.id || idx}
                          style={{
                            borderTop: '1px solid var(--border-subtle)',
                            background: idx === 0 ? 'rgba(0, 242, 254, 0.02)' : 'transparent',
                          }}
                        >
                          <td style={{ padding: '10px 14px' }}>
                            <span style={{ fontWeight: 600 }}>{c.role}</span>
                            {idx === 0 && (
                              <span
                                style={{
                                  marginLeft: '6px',
                                  fontSize: '0.7rem',
                                  padding: '2px 6px',
                                  borderRadius: '6px',
                                  background: 'rgba(0, 242, 254, 0.15)',
                                  color: 'var(--accent-cyan)',
                                }}
                              >
                                Dust Recipient
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '10px 14px', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                            {c.wallet_address.substring(0, 10)}...{c.wallet_address.substring(c.wallet_address.length - 6)}
                          </td>
                          <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 600 }}>{c.percentage}%</td>
                          <td style={{ padding: '10px 14px', textAlign: 'right', color: 'var(--text-muted)' }}>
                            {c.share_basis_points} bps
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                  * Invariant: Remainder stroops from integer division (1 XLM = 10,000,000 stroops) are assigned to recipient #1. Zero rounding leak.
                </p>
              </div>
            )}

            {/* Settlements History */}
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '10px' }}>
                On-Chain Settlement Receipts ({data.settlements.length})
              </h4>

              {data.settlements.length === 0 ? (
                <div
                  style={{
                    padding: '30px 20px',
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px dashed var(--border-subtle)',
                    background: 'rgba(255, 255, 255, 0.01)',
                  }}
                >
                  <p>No settlements executed for this track yet.</p>
                  {data.locked_agreement && (
                    <button
                      onClick={handleSettle}
                      disabled={isSettling}
                      style={{
                        marginTop: '12px',
                        padding: '8px 18px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
                        border: 'none',
                        color: '#070913',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                      }}
                    >
                      {isSettling ? 'Executing...' : 'Trigger Settlement Run (5.0 XLM)'}
                    </button>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {data.settlements.map((s) => (
                    <div
                      key={s.id}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 'var(--radius-md)',
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                            {s.gross_amount.toFixed(4)} XLM Distributed
                          </span>
                          <span
                            style={{
                              padding: '2px 8px',
                              borderRadius: '10px',
                              background: 'rgba(16, 185, 129, 0.15)',
                              color: 'var(--accent-emerald)',
                              fontSize: '0.72rem',
                              fontWeight: 600,
                            }}
                          >
                            {s.status}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                          {new Date(s.created_at).toLocaleString()} • Agreement v{s.agreement_version}
                        </span>
                      </div>

                      {s.tx_hash && (
                        <a
                          href={`https://stellar.expert/explorer/testnet/tx/${s.tx_hash}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            color: 'var(--accent-cyan)',
                            textDecoration: 'none',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                          }}
                        >
                          <span>Explorer</span>
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};
