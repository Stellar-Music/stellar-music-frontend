import React from 'react';
import { SplitAgreementStatus } from '../types';
import { Lock, Clock, CheckCircle2, AlertTriangle, FileEdit, Users } from 'lucide-react';

export interface SignatureStatusBadgeProps {
  status: SplitAgreementStatus;
  signedCount?: number;
  totalCount?: number;
  size?: 'sm' | 'md';
}

export const SignatureStatusBadge: React.FC<SignatureStatusBadgeProps> = ({
  status,
  signedCount,
  totalCount,
  size = 'md',
}) => {
  const isSm = size === 'sm';
  const fontSize = isSm ? '0.7rem' : '0.78rem';
  const padding = isSm ? '2px 8px' : '4px 12px';

  switch (status) {
    case 'LOCKED':
      return (
        <span
          className="badge"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            color: 'var(--accent-emerald)',
            fontSize,
            padding,
            borderRadius: 'var(--radius-full)',
            fontWeight: 700,
            letterSpacing: '0.02em',
          }}
          title="All contributors have signed. Agreement is immutable on Soroban."
        >
          <Lock size={isSm ? 11 : 13} />
          <span>Locked & Settled</span>
        </span>
      );

    case 'PARTIALLY_SIGNED':
      return (
        <span
          className="badge"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            backgroundColor: 'rgba(0, 242, 254, 0.12)',
            border: '1px solid rgba(0, 242, 254, 0.35)',
            color: 'var(--accent-cyan)',
            fontSize,
            padding,
            borderRadius: 'var(--radius-full)',
            fontWeight: 600,
          }}
          title="Partially signed. Awaiting signatures from remaining collaborators."
        >
          <Users size={isSm ? 11 : 13} />
          <span>
            {signedCount !== undefined && totalCount !== undefined
              ? `Signed (${signedCount}/${totalCount})`
              : 'Partially Signed'}
          </span>
        </span>
      );

    case 'AWAITING_SIGNATURES':
      return (
        <span
          className="badge"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            backgroundColor: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            color: 'var(--accent-amber)',
            fontSize,
            padding,
            borderRadius: 'var(--radius-full)',
            fontWeight: 600,
          }}
          title="Split proposed. Awaiting cryptographic signatures."
        >
          <Clock size={isSm ? 11 : 13} />
          <span>Awaiting Signatures</span>
        </span>
      );

    case 'REJECTED':
      return (
        <span
          className="badge"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            backgroundColor: 'rgba(244, 63, 94, 0.12)',
            border: '1px solid rgba(244, 63, 94, 0.35)',
            color: 'var(--accent-rose)',
            fontSize,
            padding,
            borderRadius: 'var(--radius-full)',
            fontWeight: 600,
          }}
        >
          <AlertTriangle size={isSm ? 11 : 13} />
          <span>Rejected</span>
        </span>
      );

    case 'DRAFT':
    default:
      return (
        <span
          className="badge"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-secondary)',
            fontSize,
            padding,
            borderRadius: 'var(--radius-full)',
            fontWeight: 600,
          }}
        >
          <FileEdit size={isSm ? 11 : 13} />
          <span>Draft Proposal</span>
        </span>
      );
  }
};

export interface ContributorSignPillProps {
  hasSigned: boolean;
  signedAt?: string | null;
  size?: 'sm' | 'md';
}

export const ContributorSignPill: React.FC<ContributorSignPillProps> = ({
  hasSigned,
  signedAt,
  size = 'sm',
}) => {
  const isSm = size === 'sm';
  const fontSize = isSm ? '0.68rem' : '0.75rem';
  const padding = isSm ? '2px 6px' : '3px 8px';

  if (hasSigned) {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '3px',
          color: 'var(--accent-emerald)',
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          padding,
          borderRadius: 'var(--radius-sm)',
          fontSize,
          fontWeight: 600,
        }}
        title={signedAt ? `Signed on ${new Date(signedAt).toLocaleDateString()}` : 'Cryptographically signed'}
      >
        <CheckCircle2 size={11} />
        <span>Signed</span>
      </span>
    );
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '3px',
        color: 'var(--accent-amber)',
        backgroundColor: 'rgba(245, 158, 11, 0.12)',
        padding,
        borderRadius: 'var(--radius-sm)',
        fontSize,
        fontWeight: 600,
      }}
      title="Awaiting signature"
    >
      <Clock size={11} />
      <span>Pending</span>
    </span>
  );
};
