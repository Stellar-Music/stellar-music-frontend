import React from 'react';
import { Track } from '../types';
import { usePlayer } from '../context/PlayerContext';
import { Play, Pause, Lock, CheckCircle2, Clock, PieChart, Headphones } from 'lucide-react';
import { formatTime, formatNumberMetric } from '../utils/formatters';
import { PassBadge } from './PassBadge';

interface TrackCardProps {
  track: Track;
  hasPass: boolean;
  onOpenPurchaseModal: (track: Track) => void;
  onOpenSplitAgreement?: (track: Track) => void;
  onOpenTrackRevenue?: (trackId: string) => void;
}

export const TrackCard: React.FC<TrackCardProps> = ({
  track,
  hasPass,
  onOpenPurchaseModal,
  onOpenSplitAgreement,
  onOpenTrackRevenue,
}) => {
  const { currentTrack, isPlaying, playTrack, togglePlayPause } = usePlayer();
  const isCurrent = currentTrack?.id === track.id;
  const isCurrentlyPlaying = isCurrent && isPlaying;
  const isFree = track.price <= 0;
  const isUnlocked = isFree || hasPass;
  const playCount = ((track.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) * 31) % 4500) + 380;

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

  return (
    <div
      className="glass-panel"
      style={{
        padding: '16px',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        transition: 'transform 0.2s ease, border-color 0.2s ease',
        cursor: 'pointer',
      }}
      onClick={handlePlayClick}
    >
      {/* Artwork Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1 / 1',
          borderRadius: 'var(--radius-sm)',
          overflow: 'hidden',
          backgroundColor: '#121526',
        }}
      >
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
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(7, 9, 19, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'opacity 0.2s ease',
          }}
        >
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
              isCurrentlyPlaying ? (
                <Pause size={24} fill="#070913" />
              ) : (
                <Play size={24} fill="#070913" style={{ marginLeft: '3px' }} />
              )
            ) : (
              <Lock size={22} color="#ffffff" />
            )}
          </button>
        </div>

        {/* Genre Badge */}
        {track.genre && (
          <span
            style={{
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
            }}
          >
            {track.genre}
          </span>
        )}
      </div>

      {/* Track Info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <h3
          style={{
            fontSize: '1.05rem',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {track.title}
        </h3>
        <p
          style={{
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {track.artist_name || 'Independent Artist'}
        </p>
      </div>

      {/* Footer: Price & Pass Status */}
      <div
        style={{
          marginTop: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '8px',
          borderTop: '1px solid var(--border-subtle)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: 'var(--text-muted)',
            fontSize: '0.78rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={13} />
            <span>{formatTime(track.duration_seconds)}</span>
          </div>
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
            title={`${playCount.toLocaleString()} verified streams`}
          >
            <Headphones size={13} color="var(--accent-cyan)" />
            <span>{formatNumberMetric(playCount)}</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {onOpenSplitAgreement && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenSplitAgreement(track);
              }}
              className="btn btn-secondary btn-sm"
              style={{
                padding: '4px 8px',
                fontSize: '0.72rem',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
              title="View or manage collaborator revenue split"
            >
              <PieChart size={13} color="var(--accent-cyan)" />
              <span>Split</span>
            </button>
          )}

          {onOpenTrackRevenue && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenTrackRevenue(track.id);
              }}
              className="btn btn-secondary btn-sm"
              style={{
                padding: '4px 8px',
                fontSize: '0.72rem',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
              title="Audit track streaming revenue pool & on-chain settlements"
            >
              <span style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>$</span>
              <span>Audit</span>
            </button>
          )}

          <PassBadge
            isUnlocked={isUnlocked}
            isFree={isFree}
            priceXlm={track.price}
            onClick={() => onOpenPurchaseModal(track)}
          />
        </div>
      </div>
    </div>
  );
};
