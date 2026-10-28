import { describe, it, expect } from 'vitest';
import { filterAndSortTracks, TrackFilterable } from './searchFilter';

const mockTracks: TrackFilterable[] = [
  { id: 1, title: 'Astral Drift', artist: 'Stellar Soundscape', genre: 'Synthwave', pass_price: 5.0, play_count: 1200 },
  { id: 2, title: 'Lagos Sunset', artist: 'Burna Waves', genre: 'Afrobeats', pass_price: 2.5, play_count: 3400 },
  { id: 3, title: 'Midnight Chill', artist: 'Lo-Fi Panda', genre: 'Lo-Fi', pass_price: 0.0, play_count: 850 },
  { id: 4, title: 'Cosmic Voyage', artist: 'Stellar Soundscape', genre: 'Ambient', pass_price: 10.0, play_count: 500 },
];

describe('Track Search and Filtering Utility', () => {
  it('returns all tracks when no filter options provided', () => {
    const results = filterAndSortTracks(mockTracks);
    expect(results.length).toBe(4);
  });

  it('filters tracks by multi-word text query', () => {
    const results = filterAndSortTracks(mockTracks, { query: 'stellar drift' });
    expect(results.length).toBe(1);
    expect(results[0].title).toBe('Astral Drift');
  });

  it('filters tracks by specific genre', () => {
    const results = filterAndSortTracks(mockTracks, { genre: 'Afrobeats' });
    expect(results.length).toBe(1);
    expect(results[0].title).toBe('Lagos Sunset');
  });

  it('filters tracks by price range', () => {
    const freeTracks = filterAndSortTracks(mockTracks, { maxPrice: 0 });
    expect(freeTracks.length).toBe(1);
    expect(freeTracks[0].title).toBe('Midnight Chill');

    const midRange = filterAndSortTracks(mockTracks, { minPrice: 3.0, maxPrice: 8.0 });
    expect(midRange.length).toBe(1);
    expect(midRange[0].title).toBe('Astral Drift');
  });

  it('sorts tracks by popularity descending', () => {
    const results = filterAndSortTracks(mockTracks, { sortBy: 'popular' });
    expect(results[0].title).toBe('Lagos Sunset'); // 3400 plays
    expect(results[1].title).toBe('Astral Drift'); // 1200 plays
  });

  it('sorts tracks by price ascending', () => {
    const results = filterAndSortTracks(mockTracks, { sortBy: 'price_asc' });
    expect(results[0].pass_price).toBe(0.0);
    expect(results[results.length - 1].pass_price).toBe(10.0);
  });
});
