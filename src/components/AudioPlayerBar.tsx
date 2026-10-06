import React, { useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { Play, Pause, Volume2, VolumeX, AlertCircle, Loader2, RotateCcw, RotateCw } from 'lucide-react';

export const AudioPlayerBar: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isLoading,
    error,
    togglePlayPause,
    seek,
    setVolume,
  } = usePlayer();

  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(volume);

  if (!currentTrack) return null;

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const mins = Math.floor(secs / 60);
    const rem = Math.floor(secs % 60);
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    seek(val);
  };

  const handleVolumeToggle = () => {
    if (isMuted) {
      setIsMuted(false);
      setVolume(prevVolume || 0.8);
    } else {
      setPrevVolume(volume);
      setIsMuted(true);
      setVolume(0);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      backgroundColor: 'rgba(9, 12, 24, 0.92)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(0, 242, 254, 0.2)',
      boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.6)',
      padding: '12px 28px',
    }}>
      <div style={{
        maxWidth: '1300px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr 2fr 1fr',
        alignItems: 'center',
        gap: '24px',
      }}>
        {/* Left: Track Information */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '10px',
            overflow: 'hidden',
            flexShrink: 0,
            backgroundColor: '#121526',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
          }}>
            <img
              src={currentTrack.artwork_reference}
              alt={currentTrack.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div style={{ minWidth: 0, overflow: 'hidden' }}>
            <div style={{
              fontWeight: 700,
              fontSize: '0.95rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              color: 'var(--text-primary)',
            }}>
              {currentTrack.title}
            </div>
            <div style={{
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {currentTrack.artist_name || 'Independent Artist'}
            </div>
          </div>
        </div>

        {/* Center: Playback Controls & Progress Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          {/* Action buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <button
              onClick={() => seek(Math.max(0, currentTime - 10))}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                padding: '4px',
              }}
              title="Skip back 10s"
            >
              <RotateCcw size={18} />
            </button>

            <button
              onClick={togglePlayPause}
              disabled={isLoading}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'var(--gradient-stellar)',
                color: '#070913',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 16px rgba(0, 242, 254, 0.4)',
                transition: 'transform 0.15s ease',
              }}
              onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
              onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              {isLoading ? (
                <Loader2 size={20} style={{ animation: 'spin 1.5s linear infinite' }} />
              ) : isPlaying ? (
                <Pause size={20} fill="#070913" />
              ) : (
                <Play size={20} fill="#070913" style={{ marginLeft: '2px' }} />
              )}
            </button>

            <button
              onClick={() => seek(Math.min(duration, currentTime + 10))}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                padding: '4px',
              }}
              title="Skip ahead 10s"
            >
              <RotateCw size={18} />
            </button>
          </div>

          {/* Scrubber slider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', maxWidth: '520px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace', width: '35px', textAlign: 'right' }}>
              {formatTime(currentTime)}
            </span>

            <input
              type="range"
              min="0"
              max={duration || 100}
              step="0.1"
              value={currentTime}
              onChange={handleSeekChange}
              style={{
                flex: 1,
                cursor: 'pointer',
                accentColor: 'var(--accent-cyan)',
                height: '4px',
              }}
            />

            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace', width: '35px' }}>
              {formatTime(duration)}
            </span>
          </div>

          {error && (
            <div style={{
              fontSize: '0.78rem',
              color: 'var(--accent-rose)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              marginTop: '2px',
            }}>
              <AlertCircle size={13} />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Right: Volume & Streaming Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: isPlaying ? 'var(--accent-emerald)' : 'var(--text-muted)',
              boxShadow: isPlaying ? '0 0 10px var(--accent-emerald)' : 'none',
            }} />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {isPlaying ? 'Live Streaming' : 'Paused'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handleVolumeToggle}
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}
            >
              {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setIsMuted(false);
                setVolume(parseFloat(e.target.value));
              }}
              style={{
                width: '80px',
                cursor: 'pointer',
                accentColor: 'var(--accent-cyan)',
                height: '4px',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
