import React, { useState } from 'react';
import { Track, ContributorInput } from '../types';
import { api } from '../services/api';
import { useWallet } from '../context/WalletContext';
import { X, Plus, Trash2, PieChart, AlertCircle, CheckCircle2 } from 'lucide-react';

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

  const totalPercentage = contributors.reduce((acc, c) => acc + (parseFloat(c.percentage.toString()) || 0), 0);
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
      setError(`Split total must equal exactly 100.0%. Current total: ${totalPercentage.toFixed(1)}%`);
      return;
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
          maxWidth: '680px',
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
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'var(--gradient-stellar)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
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
          <div style={{
            padding: '12px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'rgba(244, 63, 94, 0.15)',
            color: '#fca5a5',
            fontSize: '0.85rem',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* 100% Allocation Visual Progress Bar */}
        <div style={{
          padding: '16px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '20px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Total Revenue Allocation
            </span>
            <span style={{
              fontSize: '0.9rem',
              fontWeight: 700,
              color: isValidTotal ? 'var(--accent-emerald)' : totalPercentage > 100 ? 'var(--accent-rose)' : 'var(--accent-amber)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              {isValidTotal && <CheckCircle2 size={16} />}
              {totalPercentage.toFixed(1)}% / 100.0%
            </span>
          </div>

          <div style={{
            height: '8px',
            borderRadius: '4px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${Math.min(100, totalPercentage)}%`,
              height: '100%',
              background: isValidTotal ? 'var(--accent-emerald)' : totalPercentage > 100 ? 'var(--accent-rose)' : 'var(--gradient-stellar)',
              transition: 'width 0.3s ease',
            }} />
          </div>

          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
            {isValidTotal ? (
              <span style={{ color: 'var(--accent-emerald)' }}>✓ Exactly 100.0% allocated. Ready to submit for contributor signatures.</span>
            ) : totalPercentage < 100 ? (
              <span style={{ color: 'var(--accent-amber)' }}>Remaining: {(100 - totalPercentage).toFixed(1)}% unassigned. Total must equal 100.0%.</span>
            ) : (
              <span style={{ color: 'var(--accent-rose)' }}>Over-allocated by {(totalPercentage - 100).toFixed(1)}%. Please reduce shares.</span>
            )}
          </div>
        </div>

        {/* Contributor List Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
            {contributors.map((c, index) => (
              <div
                key={index}
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                    Contributor #{index + 1}
                  </span>
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
                    <option value="Artist">Artist</option>
                    <option value="Producer">Producer</option>
                    <option value="Songwriter">Songwriter</option>
                    <option value="Composer">Composer</option>
                    <option value="Engineer">Engineer</option>
                    <option value="Label">Label</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '10px' }}>
                  <input
                    type="text"
                    required
                    placeholder="Stellar Public Key (G...)"
                    value={c.wallet_address}
                    onChange={(e) => handleUpdateContributor(index, 'wallet_address', e.target.value)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      fontFamily: 'monospace',
                      fontSize: '0.8rem',
                      outline: 'none',
                    }}
                  />

                  <div style={{ position: 'relative' }}>
                    <input
                      type="number"
                      step="0.5"
                      min="0.1"
                      max="100"
                      required
                      placeholder="Share"
                      value={c.percentage}
                      onChange={(e) => handleUpdateContributor(index, 'percentage', parseFloat(e.target.value) || 0)}
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
                    <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      %
                    </span>
                  </div>
                </div>
              </div>
            ))}
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
            style={{ width: '100%', opacity: isValidTotal ? 1 : 0.5, cursor: isValidTotal ? 'pointer' : 'not-allowed' }}
          >
            {isSubmitting ? 'Creating Agreement...' : 'Generate & Submit Split Agreement'}
          </button>
        </form>
      </div>
    </div>
  );
};
