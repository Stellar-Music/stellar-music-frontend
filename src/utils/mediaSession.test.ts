import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  isMediaSessionSupported,
  updateMediaSessionMetadata,
  setupMediaSessionActionHandlers,
  updateMediaSessionPositionState,
} from './mediaSession';

class MockMediaMetadata {
  title: string = '';
  artist: string = '';
  album: string = '';
  artwork: any[] = [];
  constructor(init: any) {
    Object.assign(this, init);
  }
}

describe('Media Session API Utility', () => {
  beforeEach(() => {
    (globalThis as any).MediaMetadata = MockMediaMetadata;
    (navigator as any).mediaSession = {
      metadata: null,
      setActionHandler: vi.fn(),
      setPositionState: vi.fn(),
    };
  });

  it('detects media session support in mock browser environment', () => {
    expect(isMediaSessionSupported()).toBe(true);
  });

  it('sets metadata when a track is playing', () => {
    updateMediaSessionMetadata({
      title: 'Astral Drift',
      artist: 'Stellar Drift',
      album: 'Cosmic Sessions',
      artworkUrl: 'https://example.com/art.png',
    });

    expect(navigator.mediaSession.metadata).toBeDefined();
    expect(navigator.mediaSession.metadata?.title).toBe('Astral Drift');
    expect(navigator.mediaSession.metadata?.artist).toBe('Stellar Drift');
  });

  it('clears metadata when null track provided', () => {
    updateMediaSessionMetadata(null);
    expect(navigator.mediaSession.metadata).toBeNull();
  });

  it('binds play, pause, and seek action handlers', () => {
    const onPlay = vi.fn();
    const onPause = vi.fn();
    const onSeekForward = vi.fn();

    setupMediaSessionActionHandlers({
      onPlay,
      onPause,
      onSeekForward,
    });

    expect(navigator.mediaSession.setActionHandler).toHaveBeenCalledWith('play', onPlay);
    expect(navigator.mediaSession.setActionHandler).toHaveBeenCalledWith('pause', onPause);
    expect(navigator.mediaSession.setActionHandler).toHaveBeenCalledWith('seekforward', onSeekForward);
  });

  it('updates position state when within valid duration bounds', () => {
    updateMediaSessionPositionState({
      duration: 180,
      playbackRate: 1.0,
      position: 45,
    });

    expect(navigator.mediaSession.setPositionState).toHaveBeenCalledWith({
      duration: 180,
      playbackRate: 1.0,
      position: 45,
    });
  });
});
