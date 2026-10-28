import { describe, it, expect } from 'vitest';
import {
  formatDuration,
  formatTimeRemaining,
  calculateProgressPercentage,
  parseTimeString,
} from './timeFormat';

describe('Time and Duration Utilities', () => {
  it('formats standard seconds into m:ss', () => {
    expect(formatDuration(0)).toBe('0:00');
    expect(formatDuration(7)).toBe('0:07');
    expect(formatDuration(65)).toBe('1:05');
    expect(formatDuration(214)).toBe('3:34');
  });

  it('formats long durations into h:mm:ss', () => {
    expect(formatDuration(3600)).toBe('1:00:00');
    expect(formatDuration(3665)).toBe('1:01:05');
    expect(formatDuration(7322)).toBe('2:02:02');
  });

  it('handles negative, NaN, and infinite inputs safely', () => {
    expect(formatDuration(-10)).toBe('0:00');
    expect(formatDuration(NaN)).toBe('0:00');
    expect(formatDuration(Infinity)).toBe('0:00');
  });

  it('formats time remaining with negative prefix', () => {
    expect(formatTimeRemaining(45, 180)).toBe('-2:15');
    expect(formatTimeRemaining(180, 180)).toBe('-0:00');
    expect(formatTimeRemaining(200, 180)).toBe('-0:00');
  });

  it('calculates progress percentage clamped between 0 and 100', () => {
    expect(calculateProgressPercentage(50, 200)).toBe(25);
    expect(calculateProgressPercentage(0, 100)).toBe(0);
    expect(calculateProgressPercentage(120, 100)).toBe(100);
    expect(calculateProgressPercentage(-10, 100)).toBe(0);
  });

  it('parses time strings back to seconds', () => {
    expect(parseTimeString('3:34')).toBe(214);
    expect(parseTimeString('1:01:05')).toBe(3665);
    expect(parseTimeString('45')).toBe(45);
    expect(parseTimeString('')).toBe(0);
    expect(parseTimeString('invalid')).toBe(0);
  });
});
