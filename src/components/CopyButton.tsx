import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export interface CopyButtonProps {
  text: string;
  label?: string;
  size?: number;
  title?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  label,
  size = 14,
  title = 'Copy to clipboard',
  className = '',
  style = {},
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older environments
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`copy-btn ${className}`}
      title={copied ? 'Copied to clipboard!' : title}
      aria-label={copied ? 'Copied!' : title}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: label ? '6px' : '0',
        padding: label ? '4px 8px' : '3px',
        background: 'none',
        border: 'none',
        borderRadius: 'var(--radius-sm)',
        color: copied ? 'var(--accent-emerald)' : 'var(--text-muted)',
        cursor: 'pointer',
        transition: 'color 0.15s ease, transform 0.1s ease',
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!copied) e.currentTarget.style.color = 'var(--accent-cyan)';
      }}
      onMouseLeave={(e) => {
        if (!copied) e.currentTarget.style.color = 'var(--text-muted)';
      }}
    >
      {copied ? (
        <Check size={size} color="var(--accent-emerald)" style={{ animation: 'scaleIn 0.2s ease-out' }} />
      ) : (
        <Copy size={size} />
      )}
      {label && <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{copied ? 'Copied' : label}</span>}
    </button>
  );
};
