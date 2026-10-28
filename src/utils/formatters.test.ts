import { describe, it, expect } from 'vitest';
import {
  formatTime,
  truncateAddress,
  formatBasisPoints,
  formatStroopsToXlm,
  formatNumberMetric,
} from './formatters';

describe('formatters utility', () => {
  describe('formatTime', () => {
    it('formats seconds under one minute', () => {
      expect(formatTime(0)).toBe('0:00');
      expect(formatTime(5)).toBe('0:05');
      expect(formatTime(59)).toBe('0:59');
    });

    it('formats minutes and seconds', () => {
      expect(formatTime(60)).toBe('1:00');
      expect(formatTime(125)).toBe('2:05');
      expect(formatTime(599)).toBe('9:59');
    });

    it('formats hours for long audio recordings', () => {
      expect(formatTime(3600)).toBe('1:00:00');
      expect(formatTime(3665)).toBe('1:01:05');
      expect(formatTime(7322)).toBe('2:02:02');
    });

    it('handles negative or invalid seconds gracefully', () => {
      expect(formatTime(-10)).toBe('0:00');
      expect(formatTime(NaN)).toBe('0:00');
    });
  });

  describe('truncateAddress', () => {
    it('returns empty string for null/undefined', () => {
      expect(truncateAddress(null)).toBe('');
      expect(truncateAddress(undefined)).toBe('');
      expect(truncateAddress('')).toBe('');
    });

    it('truncates standard 56-char Stellar G... address', () => {
      const addr = 'GA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVWGS';
      expect(truncateAddress(addr)).toBe('GA7QYN...VWGS');
    });

    it('supports custom prefix and suffix lengths', () => {
      const addr = 'GA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLTJJFC7MGXUA74P7UJVWGS';
      expect(truncateAddress(addr, 4, 3)).toBe('GA7Q...WGS');
    });

    it('returns full string if shorter than start + end', () => {
      expect(truncateAddress('SHORT', 4, 4)).toBe('SHORT');
    });
  });

  describe('formatBasisPoints', () => {
    it('formats zero and 100% basis points', () => {
      expect(formatBasisPoints(0)).toBe('0.00%');
      expect(formatBasisPoints(10000)).toBe('100.00%');
    });

    it('formats fractional basis points correctly', () => {
      expect(formatBasisPoints(5000)).toBe('50.00%');
      expect(formatBasisPoints(2550)).toBe('25.50%');
      expect(formatBasisPoints(75)).toBe('0.75%');
    });

    it('handles NaN gracefully', () => {
      expect(formatBasisPoints(NaN)).toBe('0.00%');
    });
  });

  describe('formatStroopsToXlm', () => {
    it('converts 10,000,000 stroops to 1 XLM', () => {
      expect(formatStroopsToXlm(10_000_000)).toBe('1.00');
      expect(formatStroopsToXlm(BigInt(10_000_000))).toBe('1.00');
      expect(formatStroopsToXlm('10000000')).toBe('1.00');
    });

    it('converts micropayment stroop values', () => {
      expect(formatStroopsToXlm(5_000_000)).toBe('0.50');
      expect(formatStroopsToXlm(100_000)).toBe('0.01');
    });

    it('handles large amounts', () => {
      expect(formatStroopsToXlm(1_000_000_000)).toBe('100.00');
    });

    it('handles invalid input', () => {
      expect(formatStroopsToXlm('not-a-number')).toBe('0.00');
    });
  });

  describe('formatNumberMetric', () => {
    it('formats numbers under 1,000 as raw strings', () => {
      expect(formatNumberMetric(0)).toBe('0');
      expect(formatNumberMetric(42)).toBe('42');
      expect(formatNumberMetric(999)).toBe('999');
    });

    it('formats thousands with k suffix', () => {
      expect(formatNumberMetric(1000)).toBe('1k');
      expect(formatNumberMetric(1420)).toBe('1.4k');
      expect(formatNumberMetric(25600)).toBe('25.6k');
    });

    it('formats millions with M suffix', () => {
      expect(formatNumberMetric(1000000)).toBe('1M');
      expect(formatNumberMetric(2400000)).toBe('2.4M');
    });

    it('handles invalid numbers gracefully', () => {
      expect(formatNumberMetric(-5)).toBe('0');
      expect(formatNumberMetric(NaN)).toBe('0');
    });
  });
});
