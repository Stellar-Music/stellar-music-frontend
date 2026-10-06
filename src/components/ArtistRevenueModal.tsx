import React, { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { api } from '../services/api';
import { ArtistRevenueSummary, Track } from '../types';
import {
  X,
  TrendingUp,
  Play,
  Lock,
  AlertTriangle,
  CheckCircle2,
  Clock,
  RefreshCw,
  Zap,
  ExternalLink,
} from 'lucide-react';

interface ArtistRevenueModalProps {
  tracks: Track[];
  onClose: () => void;
  onOpenTrackRevenue: (trackId: string) => void;
  onOpenCreateSplit: (track: Track) => void;
}

export const ArtistRevenueModal: React.FC<ArtistRevenueModalProps> = ({
  tracks,
  onClose,
  onOpenTrackRevenue,
  onOpenCreateSplit,
}) => {
  const { address, isConnected } = useWallet();
  const [summary, setSummary] = useState<ArtistRevenueSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [settlingTrackId, setSettlingTrackId] = useState<string | null>(null);
  const [runningBatch, setRunningBatch] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string; txHash?: string } | null>(null);

  const fetchArtistRevenue = async () => {
    if (!address) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await api.getArtistRevenue(address);
      setSummary(data);
    } catch (err: any) {
      console.error('Failed to load artist revenue:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtistRevenue();
  }, [address]);

  const handleSettleTrack = async (trackId: string, pendingAmount: number) => {
    if (pendingAmount <= 0) return;
    setSettlingTrackId(trackId);
    setActionMessage(null);
    try {
      const res = await api.executeTrackSettlement(trackId, pendingAmount);
      setActionMessage({
        type: 'success',
        text: `Successfully executed Stellar settlement for ${res.settlement.gross_amount} XLM!`,
        txHash: res.settlement.tx_hash,
      });
      await fetchArtistRevenue();
    } catch (err: any) {
      console.error('Settlement error:', err);
      setActionMessage({
        type: 'error',
        text: err.message || 'Failed to execute track settlement',
      });
    } finally {
      setSettlingTrackId(null);
    }
  };

  const handleRunBatchSettlement = async () => {
    setRunningBatch(true);
    setActionMessage(null);
    try {
      const res = await api.runAutomatedSettlement();
      setActionMessage({
        type: 'success',
        text: `Automated settlement run complete: ${res.settled_count} settlements executed, ${res.total_settled_amount.toFixed(4)} XLM distributed!`,
      });
      await fetchArtistRevenue();
    } catch (err: any) {
      console.error('Batch settlement error:', err);
      setActionMessage({
        type: 'error',
        text: err.message || 'Automated settlement batch failed',
      });
    } finally {
      setRunningBatch(false);
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
          maxWidth: '880px',
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
                background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TrendingUp size={26} color="#070913" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Artist Revenue Settlement Engine</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Track streaming revenue pools, execute multi-recipient payouts & reconcile on Stellar
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleRunBatchSettlement}
              disabled={runningBatch || !isConnected}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: 'var(--radius-sm)',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                border: 'none',
                color: '#fff',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: runningBatch ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
              }}
            >
              <Zap size={14} className={runningBatch ? 'animate-spin' : ''} />
              <span>{runningBatch ? 'Settling All...' : 'Run Auto Settlement'}</span>
            </button>
            <button
              onClick={fetchArtistRevenue}
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                fontSize: '0.82rem',
                cursor: 'pointer',
              }}
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Action Message Banner */}
        {actionMessage && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background:
                actionMessage.type === 'success' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
              border: `1px solid ${
                actionMessage.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'
              }`,
              color: actionMessage.type === 'success' ? 'var(--accent-emerald)' : 'var(--accent-coral)',
              fontSize: '0.88rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {actionMessage.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
              <span>{actionMessage.text}</span>
            </div>
            {actionMessage.txHash && (
              <a
                href={`https://stellar.expert/explorer/testnet/tx/${actionMessage.txHash}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: 'inherit',
                  textDecoration: 'underline',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                }}
              >
                <span>View on Explorer</span>
                <ExternalLink size={12} />
              </a>
            )}
          </div>
        )}

        {/* KPI Cards */}
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
              background: 'rgba(0, 242, 254, 0.08)',
              border: '1px solid rgba(0, 242, 254, 0.25)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)', marginBottom: '8px' }}>
              <TrendingUp size={16} />
              <span style={{ fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase' }}>Gross Streaming Revenue</span>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>
              {(summary?.total_revenue || 0).toFixed(4)}{' '}
              <span style={{ fontSize: '1rem', color: 'var(--accent-cyan)' }}>XLM</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Total fees ingested into track revenue pools
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
              {(summary?.pending_settlement || 0).toFixed(4)}{' '}
              <span style={{ fontSize: '1rem', color: 'var(--accent-amber)' }}>XLM</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Ready for immediate multi-party distribution
            </p>
          </div>

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
              <span style={{ fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase' }}>Settled On-Chain</span>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>
              {(summary?.settled_revenue || 0).toFixed(4)}{' '}
              <span style={{ fontSize: '1rem', color: 'var(--accent-emerald)' }}>XLM</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Fully disbursed to collaborator wallets on Stellar
            </p>
          </div>
        </div>

        {/* Track List */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Track Revenue Distribution Status</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {summary?.tracks.length || 0} Tracks Monitored
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {summary?.tracks.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '30px 0' }}>
              No tracks uploaded for this artist wallet yet.
            </p>
          ) : (
            summary?.tracks.map((t) => {
              const matchedTrack = tracks.find((tr) => tr.id === t.track_id);
              const isSettling = settlingTrackId === t.track_id;
              return (
                <div
                  key={t.track_id}
                  style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.98rem' }}>{t.track_title}</span>
                      {t.is_locked ? (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '2px 8px',
                            borderRadius: '10px',
                            background: 'rgba(16, 185, 129, 0.15)',
                            color: 'var(--accent-emerald)',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                          }}
                        >
                          <Lock size={10} />
                          <span>Split Locked (v{t.agreement_version})</span>
                        </span>
                      ) : (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '2px 8px',
                            borderRadius: '10px',
                            background: 'rgba(239, 68, 68, 0.15)',
                            color: 'var(--accent-coral)',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                          }}
                        >
                          <AlertTriangle size={10} />
                          <span>No Locked Split</span>
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '20px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      <span>
                        Total Revenue: <strong style={{ color: '#fff' }}>{t.total_revenue.toFixed(4)} XLM</strong>
                      </span>
                      <span>
                        Pending Settlement: <strong style={{ color: 'var(--accent-amber)' }}>{t.pending.toFixed(4)} XLM</strong>
                      </span>
                      <span>
                        Disbursed: <strong style={{ color: 'var(--accent-emerald)' }}>{t.settled.toFixed(4)} XLM</strong>
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={() => {
                        onClose();
                        onOpenTrackRevenue(t.track_id);
                      }}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-secondary)',
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                      }}
                    >
                      Audit
                    </button>

                    {t.is_locked ? (
                      <button
                        onClick={() => handleSettleTrack(t.track_id, t.pending)}
                        disabled={isSettling || t.pending <= 0}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 14px',
                          borderRadius: 'var(--radius-sm)',
                          background:
                            t.pending > 0
                              ? 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)'
                              : 'rgba(255, 255, 255, 0.05)',
                          border: 'none',
                          color: t.pending > 0 ? '#070913' : 'var(--text-muted)',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: isSettling || t.pending <= 0 ? 'not-allowed' : 'pointer',
                        }}
                      >
                        {isSettling ? (
                          <>
                            <RefreshCw size={12} className="animate-spin" />
                            <span>Settling...</span>
                          </>
                        ) : (
                          <>
                            <Play size={12} />
                            <span>Settle Now</span>
                          </>
                        )}
                      </button>
                    ) : matchedTrack ? (
                      <button
                        onClick={() => {
                          onClose();
                          onOpenCreateSplit(matchedTrack);
                        }}
                        style={{
                          padding: '6px 12px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'rgba(245, 158, 11, 0.15)',
                          border: '1px solid rgba(245, 158, 11, 0.3)',
                          color: 'var(--accent-amber)',
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                        }}
                      >
                        Set Up Split
                      </button>
                    ) : null}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
