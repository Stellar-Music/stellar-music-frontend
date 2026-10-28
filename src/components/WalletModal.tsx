import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import {
  X,
  Wallet,
  Sparkles,
  Loader2,
  ExternalLink,
  Copy,
  Check,
  Eye,
  EyeOff,
  RefreshCw,
} from 'lucide-react';
import { truncateAddress } from '../utils/formatters';

interface WalletModalProps {
  onClose: () => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({ onClose }) => {
  const {
    connectFreighter,
    connectDemoKeypair,
    generateFreshDemoKeypair,
    isConnecting,
    error,
    walletType,
    keypair,
    address,
    balance,
  } = useWallet();

  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [showSecret, setShowSecret] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleFreighter = async () => {
    try {
      setStatusMsg('Connecting to Freighter extension...');
      await connectFreighter();
      onClose();
    } catch {
      setStatusMsg(null);
    }
  };

  const handleDemoKeypair = async () => {
    try {
      setStatusMsg('Connecting with instant Stellar Testnet Keypair...');
      await connectDemoKeypair();
      onClose();
    } catch {
      setStatusMsg(null);
    }
  };

  const handleGenerateFresh = async () => {
    try {
      setStatusMsg('Generating fresh Ed25519 keypair and requesting 10,000 XLM from Friendbot...');
      await generateFreshDemoKeypair();
    } catch {
      // error handled in context
    } finally {
      setStatusMsg(null);
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
          maxWidth: '520px',
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
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'rgba(0, 242, 254, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Wallet size={22} color="var(--accent-cyan)" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Connect Stellar Wallet</h2>
            <span className="badge badge-testnet" style={{ marginTop: '3px' }}>
              ● Stellar Testnet Environment
            </span>
          </div>
        </div>

        {error && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'rgba(244, 63, 94, 0.15)',
              color: '#fca5a5',
              fontSize: '0.82rem',
              marginBottom: '16px',
            }}
          >
            {error}
          </div>
        )}

        {statusMsg && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'rgba(0, 242, 254, 0.12)',
              color: 'var(--accent-cyan)',
              fontSize: '0.82rem',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Loader2 size={16} style={{ animation: 'spin 1.5s linear infinite' }} />
            <span>{statusMsg}</span>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Freighter Option */}
          <button
            onClick={handleFreighter}
            disabled={isConnecting}
            className="glass-panel"
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              color: 'var(--text-primary)',
              textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: '#4facfe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  color: '#070913',
                }}
              >
                F
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Freighter Wallet</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Standard Stellar web browser extension
                </div>
              </div>
            </div>
          </button>

          {/* Instant Testnet Keypair Option */}
          <button
            onClick={handleDemoKeypair}
            disabled={isConnecting}
            className="glass-panel"
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              border: '1px solid rgba(0, 242, 254, 0.4)',
              backgroundColor: 'rgba(0, 242, 254, 0.06)',
              color: 'var(--text-primary)',
              textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'var(--gradient-stellar)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Sparkles size={18} color="#070913" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--accent-cyan)' }}>
                  Instant Testnet Keypair (1-Click)
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Auto-connects active keypair with 10,000 Friendbot XLM
                </div>
              </div>
            </div>
            <span className="badge badge-pass-granted" style={{ fontSize: '0.7rem' }}>
              Instant
            </span>
          </button>

          {/* Generate Fresh Evaluator Account Button */}
          <button
            onClick={handleGenerateFresh}
            disabled={isConnecting}
            className="btn btn-secondary btn-sm"
            style={{
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              borderColor: 'rgba(245, 158, 11, 0.35)',
              color: 'var(--accent-amber)',
            }}
          >
            <RefreshCw size={14} />
            <span>Generate Brand New Pre-Funded Judge Keypair</span>
          </button>
        </div>

        {/* Evaluator Keypair Details Inspector */}
        {walletType === 'keypair' && keypair && (
          <div
            style={{
              marginTop: '16px',
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(0, 242, 254, 0.04)',
              border: '1px solid rgba(0, 242, 254, 0.2)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                Active Evaluator Keypair
              </span>
              <span className="badge badge-pass-granted" style={{ fontSize: '0.68rem' }}>
                {balance} XLM
              </span>
            </div>

            {/* Public Address */}
            <div style={{ marginBottom: '8px' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Public Key (G...)</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.3)', padding: '6px 8px', borderRadius: '4px' }}>
                <span style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>
                  {address ? truncateAddress(address, 12) : ''}
                </span>
                <button
                  onClick={() => address && copyToClipboard(address, 'pubkey')}
                  style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', padding: '2px' }}
                  title="Copy full public key"
                >
                  {copiedKey === 'pubkey' ? <Check size={14} color="var(--accent-emerald)" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            {/* Secret Seed */}
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Secret Seed (S...)</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.3)', padding: '6px 8px', borderRadius: '4px' }}>
                <span style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>
                  {showSecret ? keypair.secret() : '••••••••••••••••••••••••••••••••••••••••'}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    onClick={() => setShowSecret(!showSecret)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
                    title={showSecret ? 'Hide secret' : 'Reveal secret'}
                  >
                    {showSecret ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <button
                    onClick={() => copyToClipboard(keypair.secret(), 'secret')}
                    style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', padding: '2px' }}
                    title="Copy full secret seed"
                  >
                    {copiedKey === 'secret' ? <Check size={14} color="var(--accent-emerald)" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Faucet Link */}
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <a
            href="https://laboratory.stellar.org/#account-creator?network=test"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.78rem',
              color: 'var(--accent-cyan)',
              textDecoration: 'none',
            }}
          >
            <span>Need Testnet XLM? Visit Stellar Laboratory Friendbot</span>
            <ExternalLink size={12} />
          </a>
        </div>

        <div
          style={{
            marginTop: '16px',
            padding: '12px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            lineHeight: '1.4',
          }}
        >
          💡 <strong>Stellar Testnet Guarantee:</strong> All transactions are executed against the public Stellar Horizon Testnet. Real cryptographic keys sign real ledger payments.
        </div>
      </div>
    </div>
  );
};
