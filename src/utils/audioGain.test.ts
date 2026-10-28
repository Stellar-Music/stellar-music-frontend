import { describe, it, expect } from 'vitest';
import {
  clampVolume,
  linearToDecibels,
  decibelsToLinear,
  calculatePerceptualVolume,
  formatDecibelString,
} from './audioGain';

describe('Audio Gain & Logarithmic Perception Utilities', () => {
  it('clamps volume inputs between 0.0 and 1.0', () => {
    expect(clampVolume(-0.5)).toBe(0);
    expect(clampVolume(1.5)).toBe(1);
    expect(clampVolume(0.75)).toBe(0.75);
    expect(clampVolume(NaN)).toBe(0);
  });

  it('accurately converts linear unity gain (1.0) to 0.0 dB', () => {
    expect(linearToDecibels(1.0)).toBe(0.0);
    expect(formatDecibelString(1.0)).toBe('0.0 dB');
  });

  it('converts half amplitude (~0.5) to approximately -6.0 dB', () => {
    const dB = linearToDecibels(0.5);
    expect(dB).toBeCloseTo(-6.0, 1);
  });

  it('converts decibels back to linear scale accurately', () => {
    expect(decibelsToLinear(0)).toBe(1.0);
    expect(decibelsToLinear(-6.02)).toBeCloseTo(0.5, 2);
    expect(decibelsToLinear(-80)).toBe(0);
  });

  it('calculates quadratic perceptual volume', () => {
    expect(calculatePerceptualVolume(0)).toBe(0);
    expect(calculatePerceptualVolume(1)).toBe(1);
    expect(calculatePerceptualVolume(0.5)).toBe(0.25);
  });

  it('formats zero volume as negative infinity decibels', () => {
    expect(formatDecibelString(0)).toBe('-∞ dB');
    expect(formatDecibelString(0.0001)).toBe('-∞ dB');
  });
});
