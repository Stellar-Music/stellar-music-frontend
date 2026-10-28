/**
 * Audio Gain & Perceptual Volume Utilities
 * Translates linear slider inputs into logarithmic human hearing perception (dB)
 */

export function clampVolume(volume: number): number {
  if (isNaN(volume)) return 0;
  return Math.max(0, Math.min(1, volume));
}

export function linearToDecibels(linear: number): number {
  const safeLinear = Math.max(clampVolume(linear), 0.0001);
  return Number((20 * Math.log10(safeLinear)).toFixed(1));
}

export function decibelsToLinear(dB: number): number {
  if (dB <= -80) return 0;
  return Number(Math.min(1, Math.max(0, Math.pow(10, dB / 20))).toFixed(4));
}

export function calculatePerceptualVolume(sliderValue: number): number {
  const clamped = clampVolume(sliderValue);
  // Quadratic curve aligns with human hearing sensitivity (Fletcher-Munson curves)
  return Number((clamped * clamped).toFixed(4));
}

export function formatDecibelString(linear: number): string {
  const clamped = clampVolume(linear);
  if (clamped <= 0.001) return '-∞ dB';
  const dB = linearToDecibels(clamped);
  return `${dB > 0 ? '+' : ''}${dB.toFixed(1)} dB`;
}
