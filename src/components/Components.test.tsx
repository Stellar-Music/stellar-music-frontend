import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GenreFilter, AVAILABLE_GENRES } from './GenreFilter';
import { ErrorBoundary } from './ErrorBoundary';

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
      // Suppress console.error in test output for caught boundary test
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
});
