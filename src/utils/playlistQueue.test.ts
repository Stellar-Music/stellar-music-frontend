import { describe, it, expect } from 'vitest';
import {
  getNextTrackIndex,
  getPreviousTrackIndex,
  shuffleArray,
} from './playlistQueue';

describe('Playlist Queue Management Utility', () => {
  it('increments index when playing next track in standard mode', () => {
    expect(getNextTrackIndex(0, 5, 'off')).toBe(1);
    expect(getNextTrackIndex(1, 5, 'off')).toBe(2);
    expect(getNextTrackIndex(4, 5, 'off')).toBeNull(); // End of queue
  });

  it('loops back to beginning at end of queue when repeat is set to all', () => {
    expect(getNextTrackIndex(4, 5, 'all')).toBe(0);
  });

  it('keeps current index when repeat mode is set to one', () => {
    expect(getNextTrackIndex(2, 5, 'one')).toBe(2);
    expect(getPreviousTrackIndex(2, 5, 'one')).toBe(2);
  });

  it('decrements index when playing previous track', () => {
    expect(getPreviousTrackIndex(3, 5, 'off')).toBe(2);
    expect(getPreviousTrackIndex(0, 5, 'off')).toBeNull();
    expect(getPreviousTrackIndex(0, 5, 'all')).toBe(4); // Wraps around
  });

  it('handles empty queues and invalid current index gracefully', () => {
    expect(getNextTrackIndex(0, 0)).toBeNull();
    expect(getPreviousTrackIndex(0, 0)).toBeNull();
    expect(getNextTrackIndex(-1, 3)).toBe(0);
  });

  it('shuffles queue while preserving active track at index 0 when requested', () => {
    const queue = ['track-A', 'track-B', 'track-C', 'track-D', 'track-E'];
    const shuffled = shuffleArray(queue, 2); // 'track-C' preserved

    expect(shuffled.length).toBe(queue.length);
    expect(shuffled[0]).toBe('track-C');
    expect(new Set(shuffled).size).toBe(queue.length);
  });
});
