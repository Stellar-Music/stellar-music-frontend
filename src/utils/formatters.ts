/**
 * Format duration in seconds to standard playback timestamp mm:ss or hh:mm:ss
 */
export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const formattedSecs = secs < 10 ? `0${secs}` : `${secs}`;
  if (hrs > 0) {
    const formattedMins = mins < 10 ? `0${mins}` : `${mins}`;
    return `${hrs}:${formattedMins}:${formattedSecs}`;
  }
  return `${mins}:${formattedSecs}`;
}

/**
 * Truncate a Stellar public key or contract address GXXX...XXXX
 */
export function truncateAddress(
  address: string | null | undefined,
  start: number = 6,
  end: number = 4
): string {
  if (!address) return '';
  if (address.length <= start + end) return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}

/**
 * Convert basis points (0-10,000) to human-readable percentage string
 */
export function formatBasisPoints(bps: number): string {
  if (isNaN(bps)) return '0.00%';
  return `${(bps / 100).toFixed(2)}%`;
}

/**
 * Format integer stroops into decimal XLM representation
 */
export function formatStroopsToXlm(stroops: number | bigint | string): string {
  const num = typeof stroops === 'bigint' ? Number(stroops) : parseFloat(String(stroops));
  if (isNaN(num)) return '0.00';
  return (num / 10_000_000).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 7,
  });
}
