import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { Track } from '../types';
import { api } from '../services/api';
import { useWallet } from './WalletContext';

interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isLoading: boolean;
  error: string | null;
  unlockedTrackIds: Set<string>;
  playTrack: (track: Track) => Promise<void>;
  togglePlayPause: () => void;
  seek: (time: number) => void;
  setVolume: (vol: number) => void;
  unlockTrack: (trackId: string) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { address } = useWallet();
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
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
  }, []);

  // Periodic heartbeat for streaming accounting
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

  const unlockTrack = (trackId: string) => {
    setUnlockedTrackIds((prev) => new Set(prev).add(trackId));
  };

  const playTrack = async (track: Track) => {
    if (!audioRef.current) return;
    setError(null);
    setIsLoading(true);

    // Conclude previous session if active
    if (currentSessionIdRef.current) {
      api.endStream(currentSessionIdRef.current, playbackSecondsRef.current).catch(() => {});
      currentSessionIdRef.current = null;
    }

    // Determine audio stream URL
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

      // Start streaming session accounting if wallet connected
      if (address) {
        try {
          const session = await api.startStream(track.id, address);
          currentSessionIdRef.current = session.id;
        } catch {
          // ignore session recording error if free track or preview
        }
      }
    } catch (err: any) {
      setIsPlaying(false);
      setIsLoading(false);
      setError('Playback failed. A valid Music Pass may be required.');
    }
  };

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
        playTrack,
        togglePlayPause,
        seek,
        setVolume,
        unlockTrack,
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
