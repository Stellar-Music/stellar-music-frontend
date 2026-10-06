import React, { useState } from 'react';
import { Track, PurchaseState } from '../types';
import { useWallet } from '../context/WalletContext';
import { usePlayer } from '../context/PlayerContext';
import { stellarClient } from '../services/stellar';
import { api } from '../services/api';
import { X, Lock, CheckCircle2, AlertCircle, ExternalLink, Loader2, Play, Wallet } from 'lucide-react';

interface MusicPassModalProps {
  track: Track;
  onClose: () => void;
  onOpenWallet: () => void;
}

export const MusicPassModal: React.FC<MusicPassModalProps> = ({ track, onClose, onOpenWallet }) => {
  const { address, isConnected, walletType, keypair, refreshBalance } = useWallet();
  const { playTrack, unlockTrack } = usePlayer();

  const [state, setState] = useState<PurchaseState>(isConnected ? 'READY' : 'WALLET_REQUIRED');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePurchase = async () => {
    if (!isConnected || !address) {
      setState('WALLET_REQUIRED');
      return;
    }

    try {
      setErrorMessage(null);

      // 1. SIGNING state
      setState('SIGNING');

      const destination = track.artist_wallet || 'GBU7M3L62RTR6YXZZ2WOD6W7G3D7JGBWUXR7G7C3T3G2Z7C66Q4';

      // 2. SUBMITTING state: Execute real Stellar Testnet payment
      setState('SUBMITTING');
      const result = await stellarClient.payForMusicPass({
        senderAddress: address,
        destinationAddress: destination,
        amountXLM: track.price,
        walletType: walletType || 'keypair',
        keypair,
        memoText: `Pass: ${track.title.substring(0, 20)}`,
      });

      setTxHash(result.hash);

      // 3. CONFIRMING state: Submit to backend for verification
      setState('CONFIRMING');
      await api.purchasePass({
        track_id: track.id,
        purchaser_wallet: address,
        transaction_hash: result.hash,
      });

      // 4. CONFIRMED state: Access unlocked!
      setState('CONFIRMED');
      unlockTrack(track.id);
      await refreshBalance();
    } catch (err: any) {
      if (err.message && err.message.toLowerCase().includes('reject')) {
        setState('REJECTED');
        setErrorMessage('Transaction signature was rejected.');
      } else {
        setState('FAILED');
        setErrorMessage(err.message || 'Payment execution failed on Stellar Testnet.');
      }
    }
  };

  const isBusy = state === 'SIGNING' || state === 'SUBMITTING' || state === 'CONFIRMING';

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 60,
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
          maxWidth: '520px',
          padding: '28px',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: '#0d1122',
          position: 'relative',
          border: '1px solid var(--border-hover)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isBusy}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: isBusy ? 'not-allowed' : 'pointer',
          }}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'rgba(0, 242, 254, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Lock size={20} color="var(--accent-cyan)" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Purchase Music Pass</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Decentralized access on Stellar Testnet
            </p>
          </div>
        </div>

        {/* Track Snapshot */}
        <div style={{
          display: 'flex',
          gap: '16px',
          padding: '14px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'rgba(255, 255, 255, 0.04)',
          marginBottom: '20px',
        }}>
          <img
            src={track.artwork_reference}
            alt={track.title}
            style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover' }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '4px' }}>
            <div style={{ fontSize: '1.05rem', fontWeight: 700 }}>{track.title}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {track.artist_name || 'Independent Artist'}
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          padding: '16px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '24px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Pass Access Price:</span>
            <span style={{ fontWeight: 700, color: 'var(--accent-cyan)', fontSize: '1rem' }}>
              {track.price} XLM
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Artist Payout Destination:</span>
            <span style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
              {track.artist_wallet
                ? `${track.artist_wallet.substring(0, 6)}...${track.artist_wallet.substring(track.artist_wallet.length - 6)}`
                : 'Direct Artist Address'}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Network:</span>
            <span style={{ color: 'var(--accent-cyan)' }}>Stellar Testnet Horizon</span>
          </div>
        </div>

        {/* State Machine Status Display */}
        <div style={{ marginBottom: '24px' }}>
          {state === 'WALLET_REQUIRED' && (
            <div style={{
              padding: '12px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              color: 'var(--accent-amber)',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <AlertCircle size={18} />
              <span>Please connect your Stellar Testnet wallet to purchase this pass.</span>
            </div>
          )}

          {state === 'SIGNING' && (
            <div style={{
              padding: '12px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'rgba(0, 242, 254, 0.1)',
              border: '1px solid rgba(0, 242, 254, 0.3)',
              color: 'var(--accent-cyan)',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}>
              <Loader2 size={18} className="spin" style={{ animation: 'spin 1.5s linear infinite' }} />
              <span>Awaiting signature in your wallet...</span>
            </div>
          )}

          {state === 'SUBMITTING' && (
            <div style={{
              padding: '12px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'rgba(79, 172, 254, 0.1)',
              border: '1px solid rgba(79, 172, 254, 0.3)',
              color: 'var(--accent-blue)',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}>
              <Loader2 size={18} style={{ animation: 'spin 1.5s linear infinite' }} />
              <span>Submitting payment to Stellar Testnet ledger...</span>
            </div>
          )}

          {state === 'CONFIRMING' && (
            <div style={{
              padding: '12px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'rgba(121, 40, 202, 0.15)',
              border: '1px solid rgba(121, 40, 202, 0.4)',
              color: '#d8b4fe',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}>
              <Loader2 size={18} style={{ animation: 'spin 1.5s linear infinite' }} />
              <span>Verifying transaction confirmation with backend reconciliation...</span>
            </div>
          )}

          {state === 'CONFIRMED' && (
            <div style={{
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: '#a7f3d0',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
                <CheckCircle2 size={18} color="var(--accent-emerald)" />
                <span>Music Pass Confirmed & Access Granted!</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#6ee7b7' }}>
                Your payment was verified on Stellar Testnet and recorded in the database.
              </div>
              {txHash && (
                <a
                  href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    color: 'var(--accent-cyan)',
                    fontSize: '0.78rem',
                    textDecoration: 'none',
                    fontWeight: 600,
                    marginTop: '4px',
                  }}
                >
                  <ExternalLink size={14} />
                  <span>View Transaction on Stellar Expert</span>
                </a>
              )}
            </div>
          )}

          {(state === 'FAILED' || state === 'REJECTED') && (
            <div style={{
              padding: '12px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'rgba(244, 63, 94, 0.12)',
              border: '1px solid rgba(244, 63, 94, 0.35)',
              color: '#fca5a5',
              fontSize: '0.85rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
                <AlertCircle size={18} color="var(--accent-rose)" />
                <span>{state === 'REJECTED' ? 'Transaction Cancelled' : 'Payment Failed'}</span>
              </div>
              <div style={{ fontSize: '0.8rem' }}>{errorMessage}</div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div>
          {state === 'WALLET_REQUIRED' ? (
            <button
              onClick={onOpenWallet}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              <Wallet size={18} />
              <span>Connect Wallet to Continue</span>
            </button>
          ) : state === 'CONFIRMED' ? (
            <button
              onClick={() => {
                playTrack(track);
                onClose();
              }}
              className="btn btn-primary"
              style={{ width: '100%', gap: '8px' }}
            >
              <Play size={18} />
              <span>Stream Track Now</span>
            </button>
          ) : (
            <button
              onClick={handlePurchase}
              disabled={isBusy}
              className="btn btn-primary"
              style={{
                width: '100%',
                opacity: isBusy ? 0.7 : 1,
                cursor: isBusy ? 'not-allowed' : 'pointer',
              }}
            >
              {isBusy ? (
                <>
                  <Loader2 size={18} style={{ animation: 'spin 1.5s linear infinite' }} />
                  <span>Processing Payment...</span>
                </>
              ) : state === 'FAILED' || state === 'REJECTED' ? (
                <span>Retry Purchase ({track.price} XLM)</span>
              ) : (
                <span>Confirm Purchase ({track.price} XLM)</span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
