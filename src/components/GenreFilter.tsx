import React from 'react';

export const AVAILABLE_GENRES = [
  'All',
  'Electronic',
  'Afrobeats',
  'Ambient',
  'Lo-Fi',
  'Hip-Hop',
  'Classical',
  'Jazz',
] as const;

export type GenreType = typeof AVAILABLE_GENRES[number];

interface GenreFilterProps {
  selectedGenre: string;
  onSelectGenre: (genre: string) => void;
  trackCounts?: Record<string, number>;
}

export const GenreFilter: React.FC<GenreFilterProps> = ({
  selectedGenre,
  onSelectGenre,
  trackCounts = {},
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {AVAILABLE_GENRES.map((genre) => {
        const isSelected = selectedGenre === genre;
        const count = trackCounts[genre];
        return (
          <button
            key={genre}
            onClick={() => onSelectGenre(genre)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
              isSelected
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700/80 border border-slate-700/50'
            }`}
          >
            <span>{genre}</span>
            {count !== undefined && count > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-700 text-slate-300'
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
