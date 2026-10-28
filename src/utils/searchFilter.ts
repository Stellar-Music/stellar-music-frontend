export interface TrackFilterable {
  id: string | number;
  title: string;
  artist: string;
  genre: string;
  pass_price: number;
  play_count?: number;
  created_at?: string;
}

export interface TrackFilterOptions {
  query?: string;
  genre?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'popular' | 'price_asc' | 'price_desc' | 'title';
}

export function filterAndSortTracks<T extends TrackFilterable>(
  tracks: T[],
  options: TrackFilterOptions = {}
): T[] {
  const { query, genre, minPrice, maxPrice, sortBy } = options;

  let results = [...tracks];

  // 1. Text Query Filter (Matches title, artist, or genre)
  if (query && query.trim() !== '') {
    const tokens = query.toLowerCase().trim().split(/\s+/);
    results = results.filter((track) => {
      const haystack = `${track.title} ${track.artist} ${track.genre}`.toLowerCase();
      return tokens.every((token) => haystack.includes(token));
    });
  }

  // 2. Genre Filter
  if (genre && genre.toLowerCase() !== 'all' && genre.trim() !== '') {
    results = results.filter(
      (track) => track.genre.toLowerCase() === genre.toLowerCase().trim()
    );
  }

  // 3. Price Bounds Filter
  if (typeof minPrice === 'number' && !isNaN(minPrice)) {
    results = results.filter((track) => track.pass_price >= minPrice);
  }
  if (typeof maxPrice === 'number' && !isNaN(maxPrice)) {
    results = results.filter((track) => track.pass_price <= maxPrice);
  }

  // 4. Sorting
  if (sortBy) {
    results.sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return (b.play_count || 0) - (a.play_count || 0);
        case 'price_asc':
          return a.pass_price - b.pass_price;
        case 'price_desc':
          return b.pass_price - a.pass_price;
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  }

  return results;
}
