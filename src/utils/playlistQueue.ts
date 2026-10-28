export type RepeatMode = 'off' | 'all' | 'one';

export function getNextTrackIndex(
  currentIndex: number,
  queueLength: number,
  repeatMode: RepeatMode = 'off'
): number | null {
  if (queueLength <= 0) return null;
  if (currentIndex < 0 || currentIndex >= queueLength) return 0;

  if (repeatMode === 'one') {
    return currentIndex;
  }

  if (currentIndex === queueLength - 1) {
    return repeatMode === 'all' ? 0 : null;
  }

  return currentIndex + 1;
}

export function getPreviousTrackIndex(
  currentIndex: number,
  queueLength: number,
  repeatMode: RepeatMode = 'off'
): number | null {
  if (queueLength <= 0) return null;
  if (currentIndex < 0 || currentIndex >= queueLength) return 0;

  if (repeatMode === 'one') {
    return currentIndex;
  }

  if (currentIndex === 0) {
    return repeatMode === 'all' ? queueLength - 1 : null;
  }

  return currentIndex - 1;
}

export function shuffleArray<T>(items: T[], preserveIndex: number = -1): T[] {
  if (items.length <= 1) return [...items];

  const result = [...items];
  let preservedItem: T | undefined;

  if (preserveIndex >= 0 && preserveIndex < result.length) {
    preservedItem = result.splice(preserveIndex, 1)[0];
  }

  // Fisher-Yates shuffle
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  if (preservedItem !== undefined) {
    result.unshift(preservedItem);
  }

  return result;
}
