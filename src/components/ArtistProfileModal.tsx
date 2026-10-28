import React from 'react';
import { Artist, Track } from '../types';
import { X, ShieldCheck, Music2, ExternalLink, Disc3, Play } from 'lucide-react';
import { CopyButton } from './CopyButton';
import { truncateAddress } from '../utils/formatters';

export interface ArtistProfileModalProps {
  artist: Artist | null;
  tracks: Track[];
  onClose: () => void;
  onPlayTrack?: (track: Track) => void;
}

export const ArtistProfileModal: React.FC<ArtistProfileModalProps> = ({
  artist,
  tracks,
  onClose,
  onPlayTrack,
}) => {
  if (!artist) return null;

  const artistTracks = tracks.filter(
    (t) => t.artist_id === artist.id || t.artist_wallet === artist.wallet_address
  );

  const explorerUrl = `https://stellar.expert/explorer/testnet/account/${artist.wallet_address}`;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 85,
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
          maxWidth: '560px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '28px',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: '#0d1122',
          position: 'relative',
          border: '1px solid var(--border-hover)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
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
          aria-label="Close artist profile"
        >
          <X size={20} />
        </button>

        {/* Profile Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '20px' }}>
          <div
            style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              background: 'var(--gradient-stellar)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              color: '#070913',
              fontSize: '1.7rem',
              boxShadow: '0 0 20px rgba(0, 242, 254, 0.3)',
              flexShrink: 0,
            }}
          >
            {artist.display_name.charAt(0)}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
                {artist.display_name}
              </h2>
              <span
                className="badge"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                  backgroundColor: 'rgba(0, 242, 254, 0.12)',
                  color: 'var(--accent-cyan)',
                  border: '1px solid rgba(0, 242, 254, 0.35)',
                  fontSize: '0.72rem',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                }}
              >
                <ShieldCheck size={12} />
                <span>Verified Creator</span>
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
              <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                {truncateAddress(artist.wallet_address, 8, 6)}
              </span>
              <CopyButton text={artist.wallet_address} size={13} title="Copy artist wallet" />
              <a
                href={explorerUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  color: 'var(--accent-cyan)',
                  fontSize: '0.75rem',
                  marginLeft: '4px',
                }}
                title="View on StellarExpert"
              >
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div
          style={{
            backgroundColor: '#121526',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            padding: '16px',
            marginBottom: '20px',
          }}
        >
          <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
            Artist Biography
          </span>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
            {artist.bio || `${artist.display_name} is an independent audio creator distributing verifiable music passes and automated revenue splits on Stellar.`}
          </p>
        </div>

        {/* Catalog Showcase */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Music2 size={16} color="var(--accent-cyan)" />
              <span>Catalog Releases ({artistTracks.length})</span>
            </span>
          </div>

          {artistTracks.length === 0 ? (
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              No tracks published under this artist profile yet.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {artistTracks.map((t) => (
                <div
                  key={t.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                    <Disc3 size={18} color="var(--accent-cyan)" style={{ flexShrink: 0 }} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {t.title}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        {t.genre || 'Single'} • {t.price > 0 ? `${t.price} XLM` : 'Free'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {onPlayTrack && (
                      <button
                        onClick={() => {
                          onPlayTrack(t);
                          onClose();
                        }}
                        className="btn btn-primary btn-sm"
                        style={{ padding: '4px 10px', fontSize: '0.74rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Play size={12} />
                        <span>Play</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
