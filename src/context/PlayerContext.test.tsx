import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import React from 'react';
import { PlayerProvider, usePlayer } from './PlayerContext';
import { WalletProvider } from './WalletContext';
import { Track } from '../types';

// Mock API
vi.mock('../services/api', () => ({
  api: {
    startStream: vi.fn().mockResolvedValue({ id: 'session_1' }),
    sendHeartbeat: vi.fn().mockResolvedValue(undefined),
    endStream: vi.fn().mockResolvedValue(undefined),
  },
}));

// Mock audio element methods
beforeEach(() => {
  window.HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
  window.HTMLMediaElement.prototype.pause = vi.fn();
});

const sampleTrackA: Track = {
  id: 'track_a',
  artist_id: 'artist_1',
  artist_name: 'Stellar Pulse',
  title: 'Quantum Drift',
  description: null,
  audio_reference: 'https://example.com/audio_a.mp3',
  artwork_reference: 'https://example.com/art_a.jpg',
  price: 5,
  status: 'PUBLISHED',
  genre: 'Electronic',
  duration_seconds: 180,
  created_at: '2026-01-01T00:00:00Z',
};

const sampleTrackB: Track = {
  id: 'track_b',
  artist_id: 'artist_2',
  artist_name: 'Luna Nova',
  title: 'Solar Winds',
  description: null,
  audio_reference: 'https://example.com/audio_b.mp3',
  artwork_reference: 'https://example.com/art_b.jpg',
  price: 0,
  status: 'PUBLISHED',
  genre: 'Ambient',
  duration_seconds: 240,
  created_at: '2026-01-02T00:00:00Z',
};

const TestPlayerConsumer: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    volume,
    loopMode,
    unlockedTrackIds,
    playTrack,
    togglePlayPause,
    setVolume,
    toggleLoopMode,
    unlockTrack,
    nextTrack,
    prevTrack,
  } = usePlayer();

  return (
    <div>
      <span data-testid="track-title">{currentTrack?.title || 'NO_TRACK'}</span>
      <span data-testid="playing-status">{isPlaying ? 'PLAYING' : 'PAUSED'}</span>
      <span data-testid="volume">{volume}</span>
      <span data-testid="loop-mode">{loopMode}</span>
      <span data-testid="unlocked-count">{unlockedTrackIds.size}</span>
      <button
        onClick={() => playTrack(sampleTrackA, [sampleTrackA, sampleTrackB])}
        data-testid="btn-play-a"
      >
        Play A
      </button>
      <button onClick={() => togglePlayPause()} data-testid="btn-toggle">
        Toggle
      </button>
      <button onClick={() => setVolume(0.5)} data-testid="btn-vol-half">
        Set Half Volume
      </button>
      <button onClick={() => toggleLoopMode()} data-testid="btn-loop">
        Toggle Loop
      </button>
      <button onClick={() => unlockTrack('track_a')} data-testid="btn-unlock-a">
        Unlock A
      </button>
      <button onClick={() => nextTrack()} data-testid="btn-next">
        Next Track
      </button>
      <button onClick={() => prevTrack()} data-testid="btn-prev">
        Prev Track
      </button>
    </div>
  );
};

describe('PlayerContext playback controls', () => {
  it('initializes with default resting playback state', () => {
    render(
      <WalletProvider>
        <PlayerProvider>
          <TestPlayerConsumer />
        </PlayerProvider>
      </WalletProvider>
    );

    expect(screen.getByTestId('track-title').textContent).toBe('NO_TRACK');
    expect(screen.getByTestId('playing-status').textContent).toBe('PAUSED');
    expect(screen.getByTestId('loop-mode').textContent).toBe('off');
    expect(screen.getByTestId('unlocked-count').textContent).toBe('0');
  });

  it('loads and plays a track successfully', async () => {
    render(
      <WalletProvider>
        <PlayerProvider>
          <TestPlayerConsumer />
        </PlayerProvider>
      </WalletProvider>
    );

    await act(async () => {
      screen.getByTestId('btn-play-a').click();
    });

    expect(screen.getByTestId('track-title').textContent).toBe('Quantum Drift');
    expect(screen.getByTestId('playing-status').textContent).toBe('PLAYING');
  });

  it('adjusts volume and toggles loop modes', async () => {
    render(
      <WalletProvider>
        <PlayerProvider>
          <TestPlayerConsumer />
        </PlayerProvider>
      </WalletProvider>
    );

    await act(async () => {
      screen.getByTestId('btn-vol-half').click();
    });
    expect(screen.getByTestId('volume').textContent).toBe('0.5');

    await act(async () => {
      screen.getByTestId('btn-loop').click();
    });
    expect(screen.getByTestId('loop-mode').textContent).toBe('all');

    await act(async () => {
      screen.getByTestId('btn-loop').click();
    });
    expect(screen.getByTestId('loop-mode').textContent).toBe('one');
  });

  it('tracks unlocked track IDs optimistically', async () => {
    render(
      <WalletProvider>
        <PlayerProvider>
          <TestPlayerConsumer />
        </PlayerProvider>
      </WalletProvider>
    );

    expect(screen.getByTestId('unlocked-count').textContent).toBe('0');

    await act(async () => {
      screen.getByTestId('btn-unlock-a').click();
    });

    expect(screen.getByTestId('unlocked-count').textContent).toBe('1');
  });

  it('advances to next track in queue', async () => {
    render(
      <WalletProvider>
        <PlayerProvider>
          <TestPlayerConsumer />
        </PlayerProvider>
      </WalletProvider>
    );

    await act(async () => {
      screen.getByTestId('btn-play-a').click();
    });
    expect(screen.getByTestId('track-title').textContent).toBe('Quantum Drift');

    await act(async () => {
      screen.getByTestId('btn-next').click();
    });
    expect(screen.getByTestId('track-title').textContent).toBe('Solar Winds');
  });
});
