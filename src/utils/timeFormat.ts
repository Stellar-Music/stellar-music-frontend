/**
 * Time and Audio Duration Formatting Utilities
 */

export function formatDuration(seconds: number): string {
  if (isNaN(seconds) || seconds < 0 || !isFinite(seconds)) {
    return '0:00';
  }

  const rounded = Math.floor(seconds);
  const hours = Math.floor(rounded / 3600);
  const minutes = Math.floor((rounded % 3600) / 60);
  const secs = rounded % 60;

  const paddedSecs = secs.toString().padStart(2, '0');

  if (hours > 0) {
    const paddedMins = minutes.toString().padStart(2, '0');
    return `${hours}:${paddedMins}:${paddedSecs}`;
  }

  return `${minutes}:${paddedSecs}`;
}

export function formatTimeRemaining(currentSeconds: number, totalSeconds: number): string {
  if (isNaN(currentSeconds) || isNaN(totalSeconds) || totalSeconds <= 0) {
    return '-0:00';
  }

  const remaining = Math.max(0, totalSeconds - currentSeconds);
  return `-${formatDuration(remaining)}`;
}

export function calculateProgressPercentage(current: number, total: number): number {
  if (isNaN(current) || isNaN(total) || total <= 0) {
    return 0;
  }
  const pct = (current / total) * 100;
  return Number(Math.max(0, Math.min(100, pct)).toFixed(2));
}

export function parseTimeString(timeStr: string): number {
  if (!timeStr || typeof timeStr !== 'string') return 0;
  const parts = timeStr.trim().split(':').map((p) => parseInt(p, 10));
  if (parts.some((p) => isNaN(p) || p < 0)) return 0;

  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  if (parts.length === 1) {
    return parts[0];
  }
  return 0;
}
