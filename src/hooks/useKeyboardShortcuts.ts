import { useEffect } from 'react';

export interface KeyboardShortcutActions {
  onTogglePlay?: () => void;
  onSeekBackward?: (seconds: number) => void;
  onSeekForward?: (seconds: number) => void;
  onVolumeUp?: () => void;
  onVolumeDown?: () => void;
  onToggleMute?: () => void;
  onOpenShortcutsModal?: () => void;
  enabled?: boolean;
}

export function useKeyboardShortcuts({
  onTogglePlay,
  onSeekBackward,
  onSeekForward,
  onVolumeUp,
  onVolumeDown,
  onToggleMute,
  onOpenShortcutsModal,
  enabled = true,
}: KeyboardShortcutActions) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is focused inside an input or textarea
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          onTogglePlay?.();
          break;

        case 'ArrowLeft':
          e.preventDefault();
          onSeekBackward?.(5);
          break;

        case 'ArrowRight':
          e.preventDefault();
          onSeekForward?.(5);
          break;

        case 'ArrowUp':
          e.preventDefault();
          onVolumeUp?.();
          break;

        case 'ArrowDown':
          e.preventDefault();
          onVolumeDown?.();
          break;

        case 'KeyM':
          e.preventDefault();
          onToggleMute?.();
          break;

        case 'Slash':
          if (e.shiftKey) {
            // '?' key
            e.preventDefault();
            onOpenShortcutsModal?.();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    enabled,
    onTogglePlay,
    onSeekBackward,
    onSeekForward,
    onVolumeUp,
    onVolumeDown,
    onToggleMute,
    onOpenShortcutsModal,
  ]);
}
