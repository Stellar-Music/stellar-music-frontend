import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { PwaInstallBanner } from './PwaInstallBanner';

describe('PwaInstallBanner Component', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('remains hidden by default when no beforeinstallprompt event fired', () => {
    render(<PwaInstallBanner />);
    expect(screen.queryByRole('banner')).toBeNull();
  });

  it('displays banner when beforeinstallprompt event is dispatched', () => {
    render(<PwaInstallBanner />);

    const mockEvent = new Event('beforeinstallprompt');
    (mockEvent as any).prompt = vi.fn().mockResolvedValue(undefined);
    (mockEvent as any).userChoice = Promise.resolve({ outcome: 'accepted' });

    act(() => {
      window.dispatchEvent(mockEvent);
    });

    expect(screen.getByRole('banner')).toBeDefined();
    expect(screen.getByText('Install Stellar Music')).toBeDefined();
  });

  it('triggers prompt and dismisses on install click', async () => {
    render(<PwaInstallBanner />);

    const promptSpy = vi.fn().mockResolvedValue(undefined);
    const mockEvent = new Event('beforeinstallprompt');
    (mockEvent as any).prompt = promptSpy;
    (mockEvent as any).userChoice = Promise.resolve({ outcome: 'accepted' });

    act(() => {
      window.dispatchEvent(mockEvent);
    });

    const installBtn = screen.getByRole('button', { name: /^install$/i });
    await act(async () => {
      fireEvent.click(installBtn);
    });

    expect(promptSpy).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('banner')).toBeNull();
  });

  it('dismisses banner and stores flag in sessionStorage when dismiss clicked', () => {
    render(<PwaInstallBanner />);

    const mockEvent = new Event('beforeinstallprompt');
    (mockEvent as any).prompt = vi.fn();
    (mockEvent as any).userChoice = Promise.resolve({ outcome: 'dismissed' });

    act(() => {
      window.dispatchEvent(mockEvent);
    });

    const dismissBtn = screen.getByLabelText('Dismiss install prompt');
    fireEvent.click(dismissBtn);

    expect(screen.queryByRole('banner')).toBeNull();
    expect(sessionStorage.getItem('pwa_prompt_dismissed')).toBe('true');
  });
});
