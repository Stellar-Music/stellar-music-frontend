import React from 'react';
import { Track } from '../types';
import { usePlayer } from '../context/PlayerContext';
import { Play, Pause, Lock, CheckCircle2, Clock } from 'lucide-react';

interface TrackCardProps {
  track: Track;
  hasPass: boolean;
  onOpenPurchaseModal: (track: Track) => void;
}

export const TrackCard: React.FC<TrackCardProps> = ({ track, hasPass, onOpenPurchaseModal }) => {
  const { currentTrack, isPlaying, playTrack, togglePlayPause } = usePlayer();
  const isCurrent = currentTrack?.id === track.id;
  const isCurrentlyPlaying = isCurrent && isPlaying;
  const isFree = track.price <= 0;
  const isUnlocked = isFree || hasPass;

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isUnlocked) {
      if (isCurrent) {
        togglePlayPause();
      } else {
        playTrack(track);
      }
    } else {
      onOpenPurchaseModal(track);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div
      className="glass-panel"
      style={{
        padding: '16px',
        borderRadius: 'var(--radius-lg)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        cursor: 'pointer',
        border: isCurrent ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
        background: isCurrent ? 'rgba(20, 28, 52, 0.9)' : 'var(--bg-card)',
        boxShadow: isCurrent ? 'var(--shadow-neon)' : 'var(--shadow-sm)',
      }}
      onClick={handlePlayClick}
    >
      {/* Artwork with play overlay */}
      <div style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '1/1',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        backgroundColor: '#121526',
      }}>
        <img
          src={track.artwork_reference}
          alt={track.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />

        {/* Play Button Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(7, 9, 19, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'opacity 0.2s ease',
        }}>
          <button
            onClick={handlePlayClick}
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              backgroundColor: isUnlocked ? 'var(--accent-cyan)' : 'var(--accent-purple)',
              color: '#070913',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 18px rgba(0, 0, 0, 0.4)',
              transition: 'transform 0.15s ease',
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {isUnlocked ? (
              isCurrentlyPlaying ? <Pause size={24} fill="#070913" /> : <Play size={24} fill="#070913" style={{ marginLeft: '3px' }} />
            ) : (
              <Lock size={22} color="#ffffff" />
            )}
          </button>
        </div>

        {/* Genre Badge */}
        {track.genre && (
          <span style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            backgroundColor: 'rgba(7, 9, 19, 0.75)',
            backdropFilter: 'blur(8px)',
            color: 'var(--text-secondary)',
            fontSize: '0.72rem',
            padding: '3px 8px',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 600,
          }}>
            {track.genre}
          </span>
        )}
      </div>

      {/* Track Info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {track.title}
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {track.artist_name || 'Independent Artist'}
        </p>
      </div>

      {/* Footer: Price & Pass Status */}
      <div style={{
        marginTop: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '8px',
        borderTop: '1px solid var(--border-subtle)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
          <Clock size={14} />
          <span>{formatDuration(track.duration_seconds)}</span>
        </div>

        <div>
          {isUnlocked ? (
            <span className="badge badge-pass-granted" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={13} />
              <span>{isFree ? 'Free Stream' : 'Pass Granted'}</span>
            </span>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenPurchaseModal(track);
              }}
              className="btn btn-secondary btn-sm"
              style={{
                padding: '4px 10px',
                fontSize: '0.75rem',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                color: 'var(--accent-amber)',
              }}
            >
              <Lock size={12} />
              <span>{track.price} XLM Pass</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
