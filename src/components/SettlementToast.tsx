import React, { useEffect, useState } from 'react';
import { ExternalLink, X, Coins, Sparkles } from 'lucide-react';

export interface SettlementToastData {
  message: string;
  txHash?: string;
  grossAmount?: number | string;
  recipientCount?: number;
  trackTitle?: string;
}

export interface SettlementToastProps {
  toast: SettlementToastData | null;
  onDismiss: () => void;
  autoDismissMs?: number;
}

export const SettlementToast: React.FC<SettlementToastProps> = ({
  toast,
  onDismiss,
  autoDismissMs = 8000,
}) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!toast) {
      setProgress(100);
      return;
    }

    const interval = 50;
    const decrement = (interval / autoDismissMs) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          onDismiss();
          return 0;
        }
        return prev - decrement;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [toast, autoDismissMs, onDismiss]);

  if (!toast) return null;

  return (
    <aside
      aria-label="Settlement notification"
      style={{
        position: 'fixed',
        top: '80px',
        right: '24px',
        zIndex: 100,
        width: '380px',
        maxWidth: 'calc(100vw - 48px)',
        borderRadius: 'var(--radius-md)',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.95) 0%, rgba(5, 150, 105, 0.95) 100%)',
        backdropFilter: 'blur(16px)',
        color: '#070913',
        boxShadow: '0 12px 36px rgba(16, 185, 129, 0.4), 0 0 20px rgba(0, 242, 254, 0.25)',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        animation: 'slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'rgba(7, 9, 19, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            color: '#070913',
          }}
        >
          {toast.grossAmount ? <Coins size={20} /> : <Sparkles size={20} />}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
            <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 800 }}>
              Soroban Settlement Executed
            </span>
            <button
              onClick={onDismiss}
              style={{
                background: 'none',
                border: 'none',
                color: '#070913',
                cursor: 'pointer',
                opacity: 0.7,
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
              }}
              aria-label="Dismiss settlement notification"
            >
              <X size={16} />
            </button>
          </div>

          <p style={{ margin: '4px 0 6px', fontSize: '0.9rem', fontWeight: 600, lineHeight: 1.3 }}>
            {toast.message}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {toast.recipientCount && (
              <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>
                {toast.recipientCount} collaborator{toast.recipientCount === 1 ? '' : 's'} credited
              </span>
            )}

            {toast.txHash && (
              <a
                href={`https://stellar.expert/explorer/testnet/tx/${toast.txHash}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: '#070913',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  textDecoration: 'underline',
                }}
              >
                <span>StellarExpert</span>
                <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Progress countdown bar */}
      <div
        style={{
          height: '3px',
          width: `${progress}%`,
          backgroundColor: 'rgba(7, 9, 19, 0.4)',
          transition: 'width 50ms linear',
        }}
      />
    </aside>
  );
};
