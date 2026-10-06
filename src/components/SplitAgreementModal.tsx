import React, { useState, useEffect } from 'react';
import { SplitAgreement, SplitContributor, Track } from '../types';
import { api } from '../services/api';
import { useWallet } from '../context/WalletContext';
import { X, Lock, CheckCircle2, Clock, ShieldCheck, AlertCircle, Loader2, Copy, Check } from 'lucide-react';

interface SplitAgreementModalProps {
  track: Track;
  onClose: () => void;
  onAgreementUpdated: () => void;
}

export const SplitAgreementModal: React.FC<SplitAgreementModalProps> = ({ track, onClose, onAgreementUpdated }) => {
  const { address } = useWallet();

  const [agreement, setAgreement] = useState<SplitAgreement | null>(null);
  const [contributors, setContributors] = useState<SplitContributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAgreementData = async () => {
    try {
      setLoading(true);
      const agreements = await api.getTrackSplits(track.id);
      if (agreements.length > 0) {
        // Load latest agreement
        const latest = agreements[0];
        const full = await api.getSplitById(latest.id);
        setAgreement(full.agreement);
        setContributors(full.contributors);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load split agreement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAgreementData();
  }, [track.id]);

  const handleSign = async () => {
    if (!agreement || !address) return;
    setSigning(true);
    setError(null);
    try {
      const result = await api.signSplitAgreement(agreement.id, address);
      setAgreement(result.agreement);
      await loadAgreementData();
      onAgreementUpdated();
    } catch (err: any) {
      setError(err.message || 'Signing failed');
    } finally {
      setSigning(false);
    }
  };

  const handleCopyHash = () => {
    if (agreement) {
      navigator.clipboard.writeText(agreement.agreement_hash);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  const userContributor = contributors.find(
    (c) => c.wallet_address.toUpperCase() === (address || '').toUpperCase()
  );
  const userHasSigned = userContributor?.has_signed;
  const isLocked = agreement?.status === 'LOCKED';

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 65,
      backgroundColor: 'rgba(5, 7, 15, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '640px',
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

        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center' }}>
            <Loader2 size={32} style={{ animation: 'spin 1.5s linear infinite', margin: '0 auto 12px', color: 'var(--accent-cyan)' }} />
            <p style={{ color: 'var(--text-secondary)' }}>Loading agreement terms...</p>
          </div>
        ) : !agreement ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <AlertCircle size={36} color="var(--accent-amber)" style={{ margin: '0 auto 12px' }} />
            <p style={{ color: 'var(--text-secondary)' }}>No revenue split agreement found for this track.</p>
          </div>
        ) : (
          <div>
            {/* Agreement Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '12px',
                overflow: 'hidden',
                flexShrink: 0,
              }}>
                <img
                  src={track.artwork_reference}
                  alt={track.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{track.title}</h2>
                  <span className="badge badge-testnet" style={{ fontSize: '0.72rem' }}>
                    v{agreement.version}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Revenue Split Agreement
                </div>
              </div>
            </div>

            {/* Lock Status Banner */}
            {isLocked ? (
              <div style={{
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                color: '#a7f3d0',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Lock size={18} color="var(--accent-emerald)" />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>
                    ✓ Agreement LOCKED & Immutable
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#6ee7b7' }}>
                    All required contributors have signed. Ready for Level 3 automated settlement.
                  </div>
                </div>
              </div>
            ) : (
              <div style={{
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                color: '#fde68a',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}>
                <Clock size={18} color="var(--accent-amber)" />
                <div style={{ fontSize: '0.84rem' }}>
                  Awaiting signatures from participating contributors ({contributors.filter(c => c.has_signed).length}/{contributors.length} signed)
                </div>
              </div>
            )}

            {/* Deterministic Hash Card */}
            <div style={{
              padding: '12px 14px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Deterministic Agreement Hash (SHA-256)</div>
                <div style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: 'var(--accent-cyan)', marginTop: '2px' }}>
                  {agreement.agreement_hash.substring(0, 16)}...{agreement.agreement_hash.substring(agreement.agreement_hash.length - 16)}
                </div>
              </div>
              <button
                onClick={handleCopyHash}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '6px' }}
                title="Copy hash"
              >
                {copiedHash ? <Check size={16} color="var(--accent-emerald)" /> : <Copy size={16} />}
              </button>
            </div>

            {/* Contributor List Table */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '10px', color: 'var(--text-secondary)' }}>
                Contributor Allocation Breakdown
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {contributors.map((c) => (
                  <div
                    key={c.id}
                    style={{
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{c.display_name}</span>
                        <span style={{
                          fontSize: '0.7rem',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          backgroundColor: 'rgba(255, 255, 255, 0.08)',
                          color: 'var(--text-secondary)',
                        }}>
                          {c.role}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {c.wallet_address.substring(0, 6)}...{c.wallet_address.substring(c.wallet_address.length - 6)}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                        {c.percentage}%
                      </span>

                      {c.has_signed ? (
                        <span className="badge badge-pass-granted" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={13} />
                          <span>Signed</span>
                        </span>
                      ) : (
                        <span className="badge badge-pass-needed" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={13} />
                          <span>Pending</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div style={{
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(244, 63, 94, 0.15)',
                color: '#fca5a5',
                fontSize: '0.82rem',
                marginBottom: '16px',
              }}>
                {error}
              </div>
            )}

            {/* Contributor Signature Action */}
            {!isLocked && userContributor && (
              <div style={{
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(0, 242, 254, 0.06)',
                border: '1px solid rgba(0, 242, 254, 0.3)',
                marginBottom: '16px',
              }}>
                {userHasSigned ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-emerald)', fontSize: '0.88rem', fontWeight: 600 }}>
                    <CheckCircle2 size={18} />
                    <span>You have approved this agreement. Waiting for remaining contributors.</span>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
                      Action Required: You are allocated {userContributor.percentage}% as {userContributor.role}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                      By signing, you cryptographically authorize this exact revenue split agreement terms on Stellar Testnet.
                    </div>
                    <button
                      onClick={handleSign}
                      disabled={signing}
                      className="btn btn-primary"
                      style={{ width: '100%', gap: '8px' }}
                    >
                      {signing ? (
                        <>
                          <Loader2 size={16} style={{ animation: 'spin 1.5s linear infinite' }} />
                          <span>Recording Signature...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck size={18} />
                          <span>Sign & Approve Agreement ({userContributor.percentage}%)</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
