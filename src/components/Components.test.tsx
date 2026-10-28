import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GenreFilter, AVAILABLE_GENRES } from './GenreFilter';
import { ErrorBoundary } from './ErrorBoundary';
import { PassBadge } from './PassBadge';
import { ImageFallback } from './ImageFallback';
import { ThemeToggle } from './ThemeToggle';
import { OfflineBanner } from './OfflineBanner';

describe('Frontend UI Components', () => {
  describe('GenreFilter', () => {
    it('renders all available genre pills', () => {
      const onSelect = vi.fn();
      render(<GenreFilter selectedGenre="All" onSelectGenre={onSelect} />);

      AVAILABLE_GENRES.forEach((genre) => {
        expect(screen.getByText(genre)).toBeDefined();
      });
    });

    it('invokes onSelectGenre callback when a genre is clicked', () => {
      const onSelect = vi.fn();
      render(<GenreFilter selectedGenre="All" onSelectGenre={onSelect} />);

      const electronicBtn = screen.getByText('Electronic');
      fireEvent.click(electronicBtn);

      expect(onSelect).toHaveBeenCalledWith('Electronic');
    });

    it('renders track count badge when provided', () => {
      const counts = { Electronic: 12, Ambient: 5 };
      render(<GenreFilter selectedGenre="All" onSelectGenre={() => {}} trackCounts={counts} />);

      expect(screen.getByText('12')).toBeDefined();
      expect(screen.getByText('5')).toBeDefined();
    });
  });

  describe('ErrorBoundary', () => {
    const ProblemChild = () => {
      throw new Error('Test crash in child component');
    };

    it('catches render errors and displays fallback UI', () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(
        <ErrorBoundary>
          <ProblemChild />
        </ErrorBoundary>
      );

      expect(screen.getByText('Something went wrong')).toBeDefined();
      expect(screen.getByText('Test crash in child component')).toBeDefined();

      spy.mockRestore();
    });

    it('renders custom fallback when provided', () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(
        <ErrorBoundary fallback={<div>Custom Error Screen</div>}>
          <ProblemChild />
        </ErrorBoundary>
      );

      expect(screen.getByText('Custom Error Screen')).toBeDefined();

      spy.mockRestore();
    });

    it('renders normal children when no error occurs', () => {
      render(
        <ErrorBoundary>
          <div>Healthy Child Component</div>
        </ErrorBoundary>
      );

      expect(screen.getByText('Healthy Child Component')).toBeDefined();
    });
  });

  describe('PassBadge', () => {
    it('renders "Owned Pass" badge when unlocked is true', () => {
      render(<PassBadge isUnlocked={true} isFree={false} />);
      expect(screen.getByText('Owned Pass')).toBeDefined();
    });

    it('renders "Free Stream" badge when unlocked and free', () => {
      render(<PassBadge isUnlocked={true} isFree={true} />);
      expect(screen.getByText('Free Stream')).toBeDefined();
    });

    it('renders price badge when locked with specific price', () => {
      const onBuy = vi.fn();
      render(<PassBadge isUnlocked={false} priceXlm={5} onClick={onBuy} />);
      const btn = screen.getByText('5 XLM Pass');
      expect(btn).toBeDefined();

      fireEvent.click(btn);
      expect(onBuy).toHaveBeenCalledTimes(1);
    });

    it('renders "Locked" label when price is undefined', () => {
      render(<PassBadge isUnlocked={false} />);
      expect(screen.getByText('Locked')).toBeDefined();
    });
  });

  describe('ImageFallback', () => {
    it('renders standard img tag when valid src is provided', () => {
      render(<ImageFallback src="https://example.com/artwork.jpg" alt="Album Cover" />);
      const img = screen.getByAltText('Album Cover') as HTMLImageElement;
      expect(img.tagName).toBe('IMG');
      expect(img.src).toBe('https://example.com/artwork.jpg');
    });

    it('renders placeholder vinyl artwork on image error event', () => {
      render(<ImageFallback src="https://example.com/broken.jpg" alt="Broken Cover" fallbackTitle="Track Title" />);
      const img = screen.getByAltText('Broken Cover');
      fireEvent.error(img);

      expect(screen.getByRole('img', { name: 'Broken Cover' })).toBeDefined();
      expect(screen.getByText('Track Title')).toBeDefined();
    });

    it('renders placeholder directly when src is missing or empty', () => {
      render(<ImageFallback src="" alt="Missing Artwork" fallbackTitle="Unreleased Beat" />);
      expect(screen.getByText('Unreleased Beat')).toBeDefined();
    });
  });

  describe('ThemeToggle', () => {
    beforeEach(() => {
      localStorage.clear();
      document.documentElement.removeAttribute('data-theme');
    });

    it('defaults to dark mode and switches to midnight theme on click', () => {
      render(<ThemeToggle />);
      const btn = screen.getByRole('button');
      expect(btn).toBeDefined();

      // Click to toggle
      fireEvent.click(btn);
      expect(document.documentElement.getAttribute('data-theme')).toBe('midnight');
      expect(localStorage.getItem('stellar_music_theme')).toBe('midnight');

      // Click again to toggle back to dark
      fireEvent.click(btn);
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      expect(localStorage.getItem('stellar_music_theme')).toBe('dark');
    });
  });

  describe('OfflineBanner', () => {
    it('returns null when browser is online', () => {
      const { container } = render(<OfflineBanner />);
      expect(container.firstChild).toBeNull();
    });

    it('displays offline alert when window offline event fires', () => {
      render(<OfflineBanner />);
      fireEvent(window, new Event('offline'));
      expect(screen.getByRole('status')).toBeDefined();
      expect(screen.getByText(/You are currently offline/i)).toBeDefined();
    });
  });
});
