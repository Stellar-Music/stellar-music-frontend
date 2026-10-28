export interface MediaTrackData {
  title: string;
  artist: string;
  album?: string;
  artworkUrl?: string;
}

export interface MediaSessionHandlers {
  onPlay?: () => void;
  onPause?: () => void;
  onSeekBackward?: () => void;
  onSeekForward?: () => void;
  onPreviousTrack?: () => void;
  onNextTrack?: () => void;
}

export interface MediaPositionState {
  duration: number;
  playbackRate: number;
  position: number;
}

export function isMediaSessionSupported(): boolean {
  return typeof window !== 'undefined' && 'mediaSession' in navigator;
}

export function updateMediaSessionMetadata(track: MediaTrackData | null): void {
  if (!isMediaSessionSupported()) return;

  if (!track) {
    navigator.mediaSession.metadata = null;
    return;
  }

  const artwork: MediaImage[] = [];
  if (track.artworkUrl) {
    artwork.push(
      { src: track.artworkUrl, sizes: '96x96', type: 'image/png' },
      { src: track.artworkUrl, sizes: '192x192', type: 'image/png' },
      { src: track.artworkUrl, sizes: '512x512', type: 'image/png' }
    );
  }

  navigator.mediaSession.metadata = new MediaMetadata({
    title: track.title,
    artist: track.artist,
    album: track.album || 'Stellar Music Protocol',
    artwork,
  });
}

export function setupMediaSessionActionHandlers(handlers: MediaSessionHandlers): void {
  if (!isMediaSessionSupported()) return;

  const actions: Array<[MediaSessionAction, (() => void) | undefined]> = [
    ['play', handlers.onPlay],
    ['pause', handlers.onPause],
    ['seekbackward', handlers.onSeekBackward],
    ['seekforward', handlers.onSeekForward],
    ['previoustrack', handlers.onPreviousTrack],
    ['nexttrack', handlers.onNextTrack],
  ];

  for (const [action, handler] of actions) {
    try {
      if (handler) {
        navigator.mediaSession.setActionHandler(action, handler);
      } else {
        navigator.mediaSession.setActionHandler(action, null);
      }
    } catch {
      // Ignore unsupported media session actions on older browsers
    }
  }
}

export function updateMediaSessionPositionState(state: MediaPositionState): void {
  if (!isMediaSessionSupported() || !navigator.mediaSession.setPositionState) return;

  try {
    if (state.duration > 0 && state.position >= 0 && state.position <= state.duration) {
      navigator.mediaSession.setPositionState({
        duration: state.duration,
        playbackRate: state.playbackRate || 1.0,
        position: state.position,
      });
    }
  } catch {
    // Ignore invalid position bounds
  }
}
