import React, { useState, useEffect } from 'react';
import { Track } from '../types';
import { api } from '../services/api';
import { useWallet } from '../context/WalletContext';
import {
  X,
  FileCheck2,
  Clock,
  Lock,
  ArrowRight,
  ShieldCheck,
  Music,
  PieChart,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

interface ContributorDashboardModalProps {
  tracks: Track[];
  onClose: () => void;
  onSelectTrackForAgreement: (track: Track) => void;
  onSelectTrackForCreateSplit: (track: Track) => void;
}

export const ContributorDashboardModal: React.FC<ContributorDashboardModalProps> = ({
  tracks,
  onClose,
  onSelectTrackForAgreement,
  onSelectTrackForCreateSplit,
}) => {
  const { address, isConnected } = useWallet();
  const [activeTab, setActiveTab] = useState<'contributor' | 'artist'>('contributor');
  const [filter, setFilter] = useState<'all' | 'pending_mine' | 'pending_others' | 'locked'>('all');
  const [mySplitsData, setMySplitsData] = useState<{
    awaiting_my_signature: any[];
    awaiting_others: any[];
    locked: any[];
    other: any[];
  }>({
    awaiting_my_signature: [],
    awaiting_others: [],
    locked: [],
    other: [],
  });
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!address) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await api.getMySplits(address);
      setMySplitsData(data);
    } catch (err) {
      console.error('Failed to load my splits:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [address]);

  const allSplits = [
    ...mySplitsData.awaiting_my_signature,
    ...mySplitsData.awaiting_others,
    ...mySplitsData.locked,
    ...mySplitsData.other,
  ];

  // Contributor filter logic
  const getFilteredList = () => {
    if (filter === 'all') return allSplits;
    if (filter === 'pending_mine') return mySplitsData.awaiting_my_signature;
    if (filter === 'pending_others') return mySplitsData.awaiting_others;
    if (filter === 'locked') return mySplitsData.locked;
    return allSplits;
  };

  const filteredSplits = getFilteredList();

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
          maxWidth: '820px',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'var(--gradient-stellar)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FileCheck2 size={24} color="#070913" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Splits & Revenue Agreements</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Cryptographically authorized multi-party royalty shares on Stellar
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '20px',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '12px',
          }}
        >
          <button
            onClick={() => setActiveTab('contributor')}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: activeTab === 'contributor' ? 'rgba(0, 242, 254, 0.15)' : 'transparent',
              color: activeTab === 'contributor' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <ShieldCheck size={16} />
            <span>My Collaborations ({allSplits.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('artist')}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: activeTab === 'artist' ? 'rgba(0, 242, 254, 0.15)' : 'transparent',
              color: activeTab === 'artist' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Music size={16} />
            <span>Artist Catalog ({tracks.length} Tracks)</span>
          </button>
        </div>

        {/* Contributor Tab */}
        {activeTab === 'contributor' && (
          <div>
            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
              {(
                [
                  { id: 'all', label: `All (${allSplits.length})` },
                  { id: 'pending_mine', label: `Awaiting My Signature (${mySplitsData.awaiting_my_signature.length})` },
                  { id: 'pending_others', label: `Awaiting Others (${mySplitsData.awaiting_others.length})` },
                  { id: 'locked', label: `Locked & Ready (${mySplitsData.locked.length})` },
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    border: '1px solid',
                    borderColor: filter === f.id ? 'var(--accent-cyan)' : 'var(--border-subtle)',
                    backgroundColor: filter === f.id ? 'rgba(0, 242, 254, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                    color: filter === f.id ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center' }}>
                <Loader2 size={28} style={{ animation: 'spin 1.5s linear infinite', margin: '0 auto 8px', color: 'var(--accent-cyan)' }} />
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Loading split agreements...</p>
              </div>
            ) : !isConnected ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                Please connect your Stellar wallet to view agreements where you are a contributor.
              </div>
            ) : filteredSplits.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                No agreements found matching this filter.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {filteredSplits.map((item) => {
                  const trackObj: Track = tracks.find((t) => t.id === item.track_id) || {
                    id: item.track_id,
                    artist_id: '',
                    title: item.track_title || 'Track Agreement',
                    description: '',
                    artist_name: 'Artist',
                    artist_wallet: '',
                    artwork_reference: '',
                    audio_reference: '',
                    duration_seconds: 0,
                    genre: '',
                    price: 1,
                    status: 'PUBLISHED',
                    created_at: '',
                  };

                  const isLocked = item.status === 'LOCKED';

                  return (
                    <div
                      key={item.id}
                      style={{
                        padding: '16px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '16px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '8px',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <Music size={20} color="var(--accent-cyan)" />
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{item.track_title}</span>
                            <span className="badge badge-testnet" style={{ fontSize: '0.7rem' }}>
                              v{item.version}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            Role: <strong style={{ color: 'var(--text-secondary)' }}>{item.role}</strong> • Share:{' '}
                            <strong style={{ color: 'var(--accent-cyan)' }}>{item.percentage}%</strong>
                          </div>
                        </div>
                      </div>

                      {/* Status badge */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {isLocked ? (
                          <span className="badge badge-pass-granted" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Lock size={12} />
                            <span>LOCKED</span>
                          </span>
                        ) : item.has_signed ? (
                          <span className="badge badge-pass-granted" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircle2 size={12} />
                            <span>Signed (Awaiting Others)</span>
                          </span>
                        ) : (
                          <span className="badge badge-pass-needed" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={12} />
                            <span>Awaiting My Signature</span>
                          </span>
                        )}

                        <button
                          onClick={() => {
                            onSelectTrackForAgreement(trackObj);
                            onClose();
                          }}
                          className="btn btn-secondary btn-sm"
                          style={{ gap: '6px' }}
                        >
                          <span>Review</span>
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Artist Catalog Tab */}
        {activeTab === 'artist' && (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {tracks.map((t) => (
                <div
                  key={t.id}
                  style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        flexShrink: 0,
                      }}
                    >
                      <img src={t.artwork_reference} alt={t.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{t.title}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {t.artist_name} • {t.genre}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => {
                        onSelectTrackForAgreement(t);
                        onClose();
                      }}
                      className="btn btn-secondary btn-sm"
                      style={{ gap: '6px' }}
                    >
                      <FileCheck2 size={14} />
                      <span>View Agreement</span>
                    </button>
                    <button
                      onClick={() => {
                        onSelectTrackForCreateSplit(t);
                        onClose();
                      }}
                      className="btn btn-primary btn-sm"
                      style={{ gap: '6px' }}
                    >
                      <PieChart size={14} />
                      <span>Create / Edit Split</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
