import React, { useState, useEffect, useRef } from 'react';
import { usePlayer } from '../context/PlayerContext';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  AlertCircle,
  Loader2,
  SkipBack,
  SkipForward,
  Repeat,
  Repeat1,
} from 'lucide-react';
import { formatTime } from '../utils/formatters';

export const AudioPlayerBar: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isLoading,
    error,
    loopMode,
    hasNext,
    hasPrevious,
    togglePlayPause,
    seek,
    setVolume,
    nextTrack,
    prevTrack,
    toggleLoopMode,
  } = usePlayer();

  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(volume);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverX, setHoverX] = useState<number>(0);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  // Global Keyboard Shortcuts (Space: Play/Pause, M: Mute, Left/Right: Seek 5s)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput =
        activeEl instanceof HTMLInputElement ||
        activeEl instanceof HTMLTextAreaElement ||
        activeEl instanceof HTMLSelectElement;

      if (isInput) return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        handleVolumeToggle();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        seek(Math.max(0, currentTime - 5));
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        seek(Math.min(duration, currentTime + 5));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlayPause, currentTime, duration, seek, isMuted, volume, prevVolume]);

  if (!currentTrack) return null;

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    seek(val);
  };

  const handleVolumeToggle = () => {
    if (isMuted) {
      setIsMuted(false);
      setVolume(prevVolume || 0.85);
    } else {
      setPrevVolume(volume);
      setIsMuted(true);
      setVolume(0);
    }
  };

  const handleMouseMoveScrubber = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || duration <= 0) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setHoverTime(pos * duration);
    setHoverX(e.clientX - rect.left);
  };

  const handleMouseLeaveScrubber = () => {
    setHoverTime(null);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: 'rgba(9, 12, 24, 0.94)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(0, 242, 254, 0.25)',
        boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.7)',
        padding: '10px 24px',
      }}
    >
      <div
        style={{
          maxWidth: '1300px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 2fr 1fr',
          alignItems: 'center',
          gap: '20px',
        }}
      >
        {/* Left: Track Information */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '10px',
              overflow: 'hidden',
              flexShrink: 0,
              backgroundColor: '#121526',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
            }}
          >
            <img
              src={currentTrack.artwork_reference}
              alt={currentTrack.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div style={{ minWidth: 0, overflow: 'hidden' }}>
            <div
              style={{
                fontWeight: 700,
                fontSize: '0.92rem',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                color: 'var(--text-primary)',
              }}
            >
              {currentTrack.title}
            </div>
            <div
              style={{
                fontSize: '0.78rem',
                color: 'var(--text-secondary)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {currentTrack.artist_name || 'Independent Creator'}
            </div>
          </div>
        </div>

        {/* Center: Controls & Scrubber */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          {/* Playback Button Group */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Loop Mode Toggle */}
            <button
              onClick={toggleLoopMode}
              className="btn-icon"
              title={`Repeat Mode: ${loopMode === 'off' ? 'Off' : loopMode === 'all' ? 'All Tracks' : 'Single Track'}`}
              style={{
                background: 'none',
                border: 'none',
                color: loopMode !== 'off' ? 'var(--accent-cyan)' : 'var(--text-muted)',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {loopMode === 'one' ? <Repeat1 size={17} /> : <Repeat size={17} />}
            </button>

            {/* Previous Track */}
            <button
              onClick={prevTrack}
              disabled={!hasPrevious}
              className="btn-icon"
              title="Previous Track (or restart)"
              style={{
                background: 'none',
                border: 'none',
                color: hasPrevious ? 'var(--text-primary)' : 'rgba(255, 255, 255, 0.2)',
                cursor: hasPrevious ? 'pointer' : 'default',
                padding: '4px',
              }}
            >
              <SkipBack size={19} />
            </button>

            {/* Play / Pause / Loading */}
            <button
              onClick={togglePlayPause}
              disabled={isLoading}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'var(--gradient-stellar)',
                border: 'none',
                color: '#070913',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 0 16px rgba(0, 242, 254, 0.4)',
                transition: 'transform 0.15s ease',
              }}
            >
              {isLoading ? (
                <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
              ) : isPlaying ? (
                <Pause size={20} fill="#070913" />
              ) : (
                <Play size={20} fill="#070913" style={{ marginLeft: '2px' }} />
              )}
            </button>

            {/* Next Track */}
            <button
              onClick={nextTrack}
              disabled={!hasNext}
              className="btn-icon"
              title="Next Track"
              style={{
                background: 'none',
                border: 'none',
                color: hasNext ? 'var(--text-primary)' : 'rgba(255, 255, 255, 0.2)',
                cursor: hasNext ? 'pointer' : 'default',
                padding: '4px',
              }}
            >
              <SkipForward size={19} />
            </button>
          </div>

          {/* Scrubber Progress Bar & Timestamps */}
          <div
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              position: 'relative',
            }}
          >
            <span
              style={{
                fontSize: '0.74rem',
                color: 'var(--text-muted)',
                fontFamily: 'monospace',
                minWidth: '40px',
                textAlign: 'right',
              }}
            >
              {formatTime(currentTime)}
            </span>

            {/* Hover Tooltip Pill */}
            {hoverTime !== null && (
              <div
                style={{
                  position: 'absolute',
                  top: '-26px',
                  left: `${hoverX}px`,
                  transform: 'translateX(-50%)',
                  backgroundColor: 'rgba(14, 18, 34, 0.95)',
                  color: 'var(--accent-cyan)',
                  border: '1px solid rgba(0, 242, 254, 0.3)',
                  borderRadius: '4px',
                  padding: '2px 6px',
                  fontSize: '0.7rem',
                  fontFamily: 'monospace',
                  pointerEvents: 'none',
                  zIndex: 60,
                }}
              >
                {formatTime(hoverTime)}
              </div>
            )}

            <div
              ref={progressBarRef}
              onMouseMove={handleMouseMoveScrubber}
              onMouseLeave={handleMouseLeaveScrubber}
              style={{
                flex: 1,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
              }}
            >
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeekChange}
                style={{
                  width: '100%',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  background: `linear-gradient(to right, var(--accent-cyan) ${progressPercent}%, rgba(255, 255, 255, 0.12) ${progressPercent}%)`,
                  height: '4px',
                  borderRadius: '2px',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              />
            </div>

            <span
              style={{
                fontSize: '0.74rem',
                color: 'var(--text-muted)',
                fontFamily: 'monospace',
                minWidth: '40px',
              }}
            >
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Right: Volume & Shortcuts Hint */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
          {error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--accent-rose)',
                fontSize: '0.74rem',
              }}
              title={error}
            >
              <AlertCircle size={15} />
              <span style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                Pass Required
              </span>
            </div>
          )}

          <button
            onClick={handleVolumeToggle}
            className="btn-icon"
            title={isMuted ? 'Unmute audio (M)' : 'Mute audio (M)'}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
            }}
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
              const val = parseFloat(e.target.value);
              setIsMuted(val === 0);
              setVolume(val);
            }}
            title={`Volume: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
            style={{
              width: '80px',
              appearance: 'none',
              WebkitAppearance: 'none',
              background: `linear-gradient(to right, var(--accent-cyan) ${(isMuted ? 0 : volume) * 100}%, rgba(255, 255, 255, 0.12) ${(isMuted ? 0 : volume) * 100}%)`,
              height: '4px',
              borderRadius: '2px',
              outline: 'none',
              cursor: 'pointer',
            }}
          />
        </div>
      </div>
    </div>
  );
};
