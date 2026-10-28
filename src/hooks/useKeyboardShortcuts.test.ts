import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useKeyboardShortcuts } from './useKeyboardShortcuts';

describe('useKeyboardShortcuts Hook', () => {
  it('triggers onTogglePlay when Space is pressed', () => {
    const onTogglePlay = vi.fn();
    renderHook(() => useKeyboardShortcuts({ onTogglePlay }));

    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space' }));
    expect(onTogglePlay).toHaveBeenCalledTimes(1);
  });

  it('triggers seek handlers with 5s delta when Left or Right arrows pressed', () => {
    const onSeekBackward = vi.fn();
    const onSeekForward = vi.fn();
    renderHook(() => useKeyboardShortcuts({ onSeekBackward, onSeekForward }));

    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowLeft' }));
    expect(onSeekBackward).toHaveBeenCalledWith(5);

    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowRight' }));
    expect(onSeekForward).toHaveBeenCalledWith(5);
  });

  it('triggers volume handlers when Up or Down arrows pressed', () => {
    const onVolumeUp = vi.fn();
    const onVolumeDown = vi.fn();
    renderHook(() => useKeyboardShortcuts({ onVolumeUp, onVolumeDown }));

    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowUp' }));
    expect(onVolumeUp).toHaveBeenCalledTimes(1);

    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowDown' }));
    expect(onVolumeDown).toHaveBeenCalledTimes(1);
  });

  it('triggers onToggleMute on KeyM', () => {
    const onToggleMute = vi.fn();
    renderHook(() => useKeyboardShortcuts({ onToggleMute }));

    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyM' }));
    expect(onToggleMute).toHaveBeenCalledTimes(1);
  });

  it('triggers onOpenShortcutsModal on Shift + Slash (?)', () => {
    const onOpenShortcutsModal = vi.fn();
    renderHook(() => useKeyboardShortcuts({ onOpenShortcutsModal }));

    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Slash', shiftKey: true }));
    expect(onOpenShortcutsModal).toHaveBeenCalledTimes(1);
  });

  it('ignores shortcuts when disabled', () => {
    const onTogglePlay = vi.fn();
    renderHook(() => useKeyboardShortcuts({ onTogglePlay, enabled: false }));

    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space' }));
    expect(onTogglePlay).not.toHaveBeenCalled();
  });
});
