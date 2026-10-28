import React, { useState } from 'react';
import { Track, ContributorInput } from '../types';
import { api } from '../services/api';
import { useWallet } from '../context/WalletContext';
import { X, Plus, Trash2, PieChart, AlertCircle, CheckCircle2 } from 'lucide-react';
import { formatBasisPoints } from '../utils/formatters';
import { isValidStellarAddress } from '../utils/validators';

const ROLE_PRESETS = ['Artist', 'Producer', 'Songwriter', 'Composer', 'Engineer', 'Vocalist', 'Curator'];
const SLICE_COLORS = ['#00f2fe', '#4facfe', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];

interface RevenueSplitModalProps {
  track: Track;
  onClose: () => void;
  onSplitCreated: () => void;
}

export const RevenueSplitModal: React.FC<RevenueSplitModalProps> = ({ track, onClose, onSplitCreated }) => {
  const { address } = useWallet();

  const [contributors, setContributors] = useState<ContributorInput[]>([
    {
      wallet_address: track.artist_wallet || address || '',
      display_name: track.artist_name || 'Primary Artist',
      role: 'Artist',
      percentage: 50,
    },
    {
      wallet_address: '',
      display_name: '',
      role: 'Producer',
      percentage: 50,
    },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalPercentage = contributors.reduce(
    (acc, c) => acc + (parseFloat(c.percentage.toString()) || 0),
    0
  );
  const totalBps = Math.round(totalPercentage * 100);
  const isValidTotal = Math.abs(totalPercentage - 100.0) < 0.001;

  const handleAddContributor = () => {
    setContributors([
      ...contributors,
      {
        wallet_address: '',
        display_name: '',
        role: 'Songwriter',
        percentage: 0,
      },
    ]);
  };

  const handleRemoveContributor = (index: number) => {
    if (contributors.length <= 1) return;
    setContributors(contributors.filter((_, i) => i !== index));
  };

  const handleUpdateContributor = (index: number, field: keyof ContributorInput, value: any) => {
    const updated = [...contributors];
    updated[index] = { ...updated[index], [field]: value };
    setContributors(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isValidTotal) {
      setError(`Split total must equal exactly 10,000 BPS (100.0%). Current total: ${totalBps} BPS (${totalPercentage.toFixed(1)}%)`);
      return;
    }

    // Validate all contributor Stellar addresses
    for (let i = 0; i < contributors.length; i++) {
      const check = isValidStellarAddress(contributors[i].wallet_address);
      if (!check.valid) {
        setError(`Contributor #${i + 1} (${contributors[i].display_name || 'Unnamed'}): ${check.error}`);
        return;
      }
    }

    const creatorWallet = address || track.artist_wallet || 'GASTRALDRIFT7777777777777777777777777777777777777777';

    setIsSubmitting(true);
    try {
      await api.createSplitAgreement(track.id, creatorWallet, contributors);
      onSplitCreated();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create revenue split agreement.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 65,
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
          maxWidth: '700px',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'var(--gradient-stellar)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PieChart size={22} color="#070913" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Define Revenue Split Agreement</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Configure cryptographic multi-party revenue shares for <strong>{track.title}</strong>
            </p>
          </div>
        </div>

        {error && (
          <div
            style={{
              padding: '12px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'rgba(244, 63, 94, 0.15)',
              color: '#fca5a5',
              fontSize: '0.85rem',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Multi-segment Allocation Visual Progress Bar & BPS Counter */}
        <div
          style={{
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px',
            }}
          >
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Total Revenue Allocation
            </span>
            <span
              style={{
                fontSize: '0.9rem',
                fontWeight: 700,
                color: isValidTotal
                  ? 'var(--accent-emerald)'
                  : totalPercentage > 100
                  ? 'var(--accent-rose)'
                  : 'var(--accent-amber)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {isValidTotal && <CheckCircle2 size={16} />}
              <span>{totalPercentage.toFixed(1)}%</span>
              <span style={{ fontSize: '0.75rem', opacity: 0.8, fontFamily: 'monospace' }}>
                ({totalBps.toLocaleString()} / 10,000 BPS)
              </span>
            </span>
          </div>

          {/* Segmented Bar */}
          <div
            style={{
              height: '12px',
              borderRadius: '5px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              overflow: 'hidden',
              display: 'flex',
            }}
          >
            {contributors.map((c, idx) => {
              const pct = parseFloat(c.percentage.toString()) || 0;
              if (pct <= 0) return null;
              return (
                <div
                  key={idx}
                  title={`${c.display_name || `Contributor #${idx + 1}`}: ${pct}% (${formatBasisPoints(pct * 100)})`}
                  style={{
                    width: `${Math.min(100, pct)}%`,
                    height: '100%',
                    backgroundColor: SLICE_COLORS[idx % SLICE_COLORS.length],
                    transition: 'width 0.3s ease',
                  }}
                />
              );
            })}
          </div>

          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
            {isValidTotal ? (
              <span style={{ color: 'var(--accent-emerald)' }}>
                ✓ Exactly 10,000 BPS (100.0%) allocated. Ready to submit for contributor signatures.
              </span>
            ) : totalPercentage < 100 ? (
              <span style={{ color: 'var(--accent-amber)' }}>
                Remaining: {(100 - totalPercentage).toFixed(1)}% ({((100 - totalPercentage) * 100).toFixed(0)} BPS) unassigned. Total must equal 10,000 BPS.
              </span>
            ) : (
              <span style={{ color: 'var(--accent-rose)' }}>
                Over-allocated by {(totalPercentage - 100).toFixed(1)}% ({((totalPercentage - 100) * 100).toFixed(0)} BPS). Please reduce shares.
              </span>
            )}
          </div>
        </div>

        {/* Contributor List Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
            {contributors.map((c, index) => {
              const contributorColor = SLICE_COLORS[index % SLICE_COLORS.length];
              return (
                <div
                  key={index}
                  style={{
                    padding: '14px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    border: `1px solid ${contributorColor}33`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          backgroundColor: contributorColor,
                        }}
                      />
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: contributorColor }}>
                        Contributor #{index + 1}
                      </span>
                    </div>
                    {contributors.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveContributor(index)}
                        style={{ background: 'none', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer' }}
                        title="Remove contributor"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
                    <input
                      type="text"
                      required
                      placeholder="Display Name (e.g. DJ Pulse)"
                      value={c.display_name}
                      onChange={(e) => handleUpdateContributor(index, 'display_name', e.target.value)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-primary)',
                        fontSize: '0.85rem',
                        outline: 'none',
                      }}
                    />

                    <select
                      value={c.role}
                      onChange={(e) => handleUpdateContributor(index, 'role', e.target.value)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: '#121526',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-primary)',
                        fontSize: '0.85rem',
                        outline: 'none',
                      }}
                    >
                      {ROLE_PRESETS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quick Role Selector Pills */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {ROLE_PRESETS.map((role) => (
                      <button
                        type="button"
                        key={role}
                        onClick={() => handleUpdateContributor(index, 'role', role)}
                        style={{
                          padding: '3px 8px',
                          borderRadius: '12px',
                          border: c.role === role ? `1px solid ${contributorColor}` : '1px solid rgba(255, 255, 255, 0.1)',
                          backgroundColor: c.role === role ? `${contributorColor}22` : 'transparent',
                          color: c.role === role ? contributorColor : 'var(--text-muted)',
                          fontSize: '0.72rem',
                          cursor: 'pointer',
                        }}
                      >
                        {role}
                      </button>
                    ))}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '10px' }}>
                    <div>
                      <input
                        type="text"
                        required
                        placeholder="Stellar Public Key (G...)"
                        value={c.wallet_address}
                        onChange={(e) => handleUpdateContributor(index, 'wallet_address', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          border:
                            c.wallet_address.length > 0 && !isValidStellarAddress(c.wallet_address).valid
                              ? '1px solid rgba(244, 63, 94, 0.6)'
                              : '1px solid var(--border-subtle)',
                          color: 'var(--text-primary)',
                          fontFamily: 'monospace',
                          fontSize: '0.8rem',
                          outline: 'none',
                        }}
                      />
                      {c.wallet_address.length > 0 && !isValidStellarAddress(c.wallet_address).valid && (
                        <span style={{ fontSize: '0.7rem', color: '#fca5a5', display: 'block', marginTop: '3px' }}>
                          ⚠ {isValidStellarAddress(c.wallet_address).error}
                        </span>
                      )}
                    </div>

                    <div style={{ position: 'relative' }}>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max="100"
                        required
                        placeholder="Share"
                        value={c.percentage}
                        onChange={(e) =>
                          handleUpdateContributor(index, 'percentage', parseFloat(e.target.value) || 0)
                        }
                        style={{
                          width: '100%',
                          padding: '8px 24px 8px 12px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid var(--border-subtle)',
                          color: 'var(--text-primary)',
                          fontSize: '0.85rem',
                          outline: 'none',
                        }}
                      />
                      <span
                        style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: 'var(--text-muted)',
                          fontSize: '0.8rem',
                        }}
                      >
                        %
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            <button
              type="button"
              onClick={handleAddContributor}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1, gap: '6px' }}
            >
              <Plus size={16} />
              <span>Add Contributor</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={!isValidTotal || isSubmitting}
            className="btn btn-primary"
            style={{
              width: '100%',
              opacity: isValidTotal ? 1 : 0.5,
              cursor: isValidTotal ? 'pointer' : 'not-allowed',
            }}
          >
            {isSubmitting ? 'Creating Agreement...' : 'Generate & Submit Split Agreement'}
          </button>
        </form>
      </div>
    </div>
  );
};
