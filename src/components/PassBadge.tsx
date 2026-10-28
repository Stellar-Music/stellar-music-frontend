import React from 'react';
import { Sparkles, Lock, Key } from 'lucide-react';

export interface PassBadgeProps {
  isUnlocked: boolean;
  isFree?: boolean;
  priceXlm?: number;
  compact?: boolean;
  onClick?: () => void;
}

export const PassBadge: React.FC<PassBadgeProps> = ({
  isUnlocked,
  isFree = false,
  priceXlm,
  compact = false,
  onClick,
}) => {
  if (isUnlocked) {
    if (isFree) {
      return (
        <span
          className="badge"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            background: 'rgba(59, 130, 246, 0.15)',
            border: '1px solid rgba(59, 130, 246, 0.4)',
            color: 'var(--accent-blue)',
            fontSize: compact ? '0.7rem' : '0.75rem',
            padding: compact ? '2px 6px' : '3px 8px',
            borderRadius: 'var(--radius-full)',
            fontWeight: 600,
          }}
          title="Free streaming available for everyone"
        >
          <Sparkles size={compact ? 11 : 13} />
          <span>Free Stream</span>
        </span>
      );
    }

    return (
      <span
        className="badge"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%)',
          border: '1px solid rgba(245, 158, 11, 0.5)',
          color: '#fbbf24',
          fontSize: compact ? '0.7rem' : '0.75rem',
          padding: compact ? '2px 8px' : '4px 10px',
          borderRadius: 'var(--radius-full)',
          fontWeight: 700,
          boxShadow: '0 0 10px rgba(245, 158, 11, 0.15)',
          letterSpacing: '0.02em',
        }}
        title="Pass Holder: You own on-chain access to this track"
      >
        <Key size={compact ? 11 : 13} color="#fbbf24" />
        <span>Owned Pass</span>
      </span>
    );
  }

  return (
    <button
      onClick={onClick}
      className="btn btn-secondary btn-sm"
      style={{
        padding: compact ? '3px 8px' : '4px 10px',
        fontSize: compact ? '0.72rem' : '0.75rem',
        border: '1px solid rgba(245, 158, 11, 0.4)',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        color: 'var(--accent-amber)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        cursor: onClick ? 'pointer' : 'default',
        borderRadius: 'var(--radius-full)',
        fontWeight: 600,
      }}
      title="Requires Stellar Music Pass to stream full audio"
    >
      <Lock size={compact ? 11 : 12} />
      <span>{priceXlm !== undefined ? `${priceXlm} XLM Pass` : 'Locked'}</span>
    </button>
  );
};
