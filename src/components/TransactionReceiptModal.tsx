import React, { useState } from 'react';
import { CheckCircle2, ExternalLink, ShieldCheck, ArrowUpRight, X } from 'lucide-react';
import { truncateAddress } from '../utils/formatters';
import { CopyButton } from './CopyButton';

export interface TransactionReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  txHash: string;
  title?: string;
  amountXlm?: number | string;
  recipientAddress?: string;
  memo?: string;
  timestamp?: string;
}

export const TransactionReceiptModal: React.FC<TransactionReceiptModalProps> = ({
  isOpen,
  onClose,
  txHash,
  title = 'Transaction Confirmed on Stellar',
  amountXlm,
  recipientAddress,
  memo,
  timestamp,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(txHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const explorerUrl = `https://stellar.expert/explorer/testnet/tx/${txHash}`;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 110,
        backgroundColor: 'rgba(5, 7, 15, 0.85)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '500px',
          padding: '28px',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: '#0d1122',
          position: 'relative',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(16, 185, 129, 0.15)',
        }}
        onClick={(e) => e.stopPropagation()}
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
          aria-label="Close transaction receipt"
        >
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: '2px solid var(--accent-emerald)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              color: 'var(--accent-emerald)',
            }}
          >
            <CheckCircle2 size={32} />
          </div>

          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '6px' }}>{title}</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Finalized with cryptographic consensus on Stellar Testnet
          </p>
        </div>

        <div
          style={{
            backgroundColor: '#121526',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            marginBottom: '24px',
          }}
        >
          {amountXlm !== undefined && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Amount</span>
              <span style={{ fontWeight: 700, color: 'var(--accent-cyan)', fontSize: '1rem' }}>
                {amountXlm} XLM
              </span>
            </div>
          )}

          {recipientAddress && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Recipient</span>
              <span style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                {truncateAddress(recipientAddress)}
              </span>
            </div>
          )}

          {memo && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Memo</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{memo}</span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Network</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={14} color="var(--accent-emerald)" />
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Stellar Testnet</span>
            </div>
          </div>

          {timestamp && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Timestamp</span>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{timestamp}</span>
            </div>
          )}

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              Transaction Hash
            </span>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'rgba(0, 0, 0, 0.25)',
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'monospace',
                fontSize: '0.78rem',
                color: 'var(--accent-cyan)',
              }}
            >
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '380px' }}>
                {txHash}
              </span>
              <CopyButton text={txHash} />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <a
            href={explorerUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary"
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              textDecoration: 'none',
            }}
          >
            <span>View in StellarExpert</span>
            <ArrowUpRight size={16} />
          </a>
          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{ padding: '0 20px' }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
