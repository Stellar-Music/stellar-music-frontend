import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { Track } from '../types';
import { api } from '../services/api';
import { useWallet } from './WalletContext';

export type LoopMode = 'off' | 'all' | 'one';

export interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isLoading: boolean;
  error: string | null;
  unlockedTrackIds: Set<string>;
  queue: Track[];
  queueIndex: number;
  loopMode: LoopMode;
  hasNext: boolean;
  hasPrevious: boolean;
  playTrack: (track: Track, newQueue?: Track[]) => Promise<void>;
  togglePlayPause: () => void;
  seek: (time: number) => void;
  setVolume: (vol: number) => void;
  unlockTrack: (trackId: string) => void;
  nextTrack: () => Promise<void>;
  prevTrack: () => Promise<void>;
  toggleLoopMode: () => void;
  setQueue: (tracks: Track[]) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { address } = useWallet();
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [queue, setQueueState] = useState<Track[]>([]);
  const [queueIndex, setQueueIndex] = useState<number>(-1);
  const [loopMode, setLoopMode] = useState<LoopMode>('off');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.85);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unlockedTrackIds, setUnlockedTrackIds] = useState<Set<string>>(new Set());

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentSessionIdRef = useRef<string | null>(null);
  const playbackSecondsRef = useRef<number>(0);
  const heartbeatTimerRef = useRef<any>(null);
  const queueRef = useRef<Track[]>([]);
  const queueIndexRef = useRef<number>(-1);
  const loopModeRef = useRef<LoopMode>('off');

  queueRef.current = queue;
  queueIndexRef.current = queueIndex;
  loopModeRef.current = loopMode;

  const unlockTrack = (trackId: string) => {
    setUnlockedTrackIds((prev) => new Set(prev).add(trackId));
  };

  const playTrackInternal = useCallback(async (track: Track) => {
    if (!audioRef.current) return;
    setError(null);
    setIsLoading(true);

    if (currentSessionIdRef.current) {
      api.endStream(currentSessionIdRef.current, playbackSecondsRef.current).catch(() => {});
      currentSessionIdRef.current = null;
    }

    let streamUrl: string;
    if (track.audio_reference.startsWith('http')) {
      streamUrl = track.audio_reference;
    } else {
      const walletParam = address ? `?wallet=${encodeURIComponent(address)}` : '';
      streamUrl = `/api/tracks/${track.id}/stream${walletParam}`;
    }

    audioRef.current.src = streamUrl;
    setCurrentTrack(track);
    playbackSecondsRef.current = 0;

    try {
      await audioRef.current.play();
      setIsPlaying(true);

      if (address) {
        try {
          const session = await api.startStream(track.id, address);
          currentSessionIdRef.current = session.id;
        } catch {
          // ignore session recording error
        }
      }
    } catch {
      setIsPlaying(false);
      setIsLoading(false);
      setError('Playback failed. A valid Music Pass may be required.');
    }
  }, [address]);

  const playTrack = async (track: Track, newQueue?: Track[]) => {
    if (newQueue && newQueue.length > 0) {
      setQueueState(newQueue);
      queueRef.current = newQueue;
      const idx = newQueue.findIndex((t) => t.id === track.id);
      const targetIdx = idx !== -1 ? idx : 0;
      setQueueIndex(targetIdx);
      queueIndexRef.current = targetIdx;
    } else if (queue.length === 0) {
      setQueueState([track]);
      queueRef.current = [track];
      setQueueIndex(0);
      queueIndexRef.current = 0;
    } else {
      const idx = queue.findIndex((t) => t.id === track.id);
      if (idx !== -1) {
        setQueueIndex(idx);
        queueIndexRef.current = idx;
      } else {
        const updated = [...queue, track];
        setQueueState(updated);
        queueRef.current = updated;
        setQueueIndex(updated.length - 1);
        queueIndexRef.current = updated.length - 1;
      }
    }
    await playTrackInternal(track);
  };

  const nextTrack = useCallback(async () => {
    const q = queueRef.current;
    const idx = queueIndexRef.current;
    if (q.length === 0) return;

    if (idx + 1 < q.length) {
      const nextIdx = idx + 1;
      setQueueIndex(nextIdx);
      queueIndexRef.current = nextIdx;
      await playTrackInternal(q[nextIdx]);
    } else if (loopModeRef.current === 'all') {
      setQueueIndex(0);
      queueIndexRef.current = 0;
      await playTrackInternal(q[0]);
    }
  }, [playTrackInternal]);

  const prevTrack = useCallback(async () => {
    const q = queueRef.current;
    const idx = queueIndexRef.current;
    if (q.length === 0) return;

    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      return;
    }

    if (idx - 1 >= 0) {
      const prevIdx = idx - 1;
      setQueueIndex(prevIdx);
      queueIndexRef.current = prevIdx;
      await playTrackInternal(q[prevIdx]);
    } else if (loopModeRef.current === 'all') {
      const lastIdx = q.length - 1;
      setQueueIndex(lastIdx);
      queueIndexRef.current = lastIdx;
      await playTrackInternal(q[lastIdx]);
    }
  }, [playTrackInternal]);

  const toggleLoopMode = () => {
    setLoopMode((prev) => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  };

  const setQueue = (tracks: Track[]) => {
    setQueueState(tracks);
    queueRef.current = tracks;
  };

  useEffect(() => {
    const audio = new Audio();
    audio.volume = volume;
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
        playbackSecondsRef.current = Math.floor(audioRef.current.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      if (audioRef.current) {
        setDuration(audioRef.current.duration || 0);
        setIsLoading(false);
      }
    };

    const handleWaiting = () => setIsLoading(true);
    const handlePlaying = () => {
      setIsLoading(false);
      setIsPlaying(true);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (currentSessionIdRef.current) {
        api.endStream(currentSessionIdRef.current, playbackSecondsRef.current).catch(() => {});
        currentSessionIdRef.current = null;
      }

      if (loopModeRef.current === 'one' && audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      } else {
        nextTrack();
      }
    };

    const handleError = () => {
      setIsLoading(false);
      setIsPlaying(false);
      setError('Unable to stream audio. Please ensure you hold a valid Music Pass.');
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [nextTrack, volume]);

  useEffect(() => {
    if (isPlaying && currentSessionIdRef.current) {
      heartbeatTimerRef.current = setInterval(() => {
        if (currentSessionIdRef.current) {
          api.heartbeatStream(currentSessionIdRef.current, playbackSecondsRef.current).catch(() => {});
        }
      }, 10000);
    } else {
      if (heartbeatTimerRef.current) {
        clearInterval(heartbeatTimerRef.current);
        heartbeatTimerRef.current = null;
      }
    }

    return () => {
      if (heartbeatTimerRef.current) {
        clearInterval(heartbeatTimerRef.current);
      }
    };
  }, [isPlaying]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      if (currentSessionIdRef.current) {
        api.endStream(currentSessionIdRef.current, playbackSecondsRef.current).catch(() => {});
        currentSessionIdRef.current = null;
      }
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const setVolume = (vol: number) => {
    setVolumeState(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  const hasNext = queueIndex + 1 < queue.length || loopMode === 'all';
  const hasPrevious = queueIndex > 0 || loopMode === 'all';

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        isLoading,
        error,
        unlockedTrackIds,
        queue,
        queueIndex,
        loopMode,
        hasNext,
        hasPrevious,
        playTrack,
        togglePlayPause,
        seek,
        setVolume,
        unlockTrack,
        nextTrack,
        prevTrack,
        toggleLoopMode,
        setQueue,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
