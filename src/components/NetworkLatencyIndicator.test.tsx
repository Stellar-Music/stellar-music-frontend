import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NetworkLatencyIndicator } from './NetworkLatencyIndicator';

describe('NetworkLatencyIndicator Component', () => {
  it('renders probing state when pingMs is null', () => {
    render(<NetworkLatencyIndicator />);
    expect(screen.getByRole('status')).toBeDefined();
    expect(screen.getByText('Probing...')).toBeDefined();
    expect(screen.getByText('Testnet')).toBeDefined();
  });

  it('renders optimal green latency when pingMs < 150', () => {
    render(<NetworkLatencyIndicator pingMs={45} />);
    expect(screen.getByText('45ms')).toBeDefined();
  });

  it('renders moderate amber latency when 150 <= pingMs < 400', () => {
    render(<NetworkLatencyIndicator pingMs={280} />);
    expect(screen.getByText('280ms')).toBeDefined();
  });

  it('renders high latency warning when pingMs >= 400', () => {
    render(<NetworkLatencyIndicator pingMs={650} />);
    expect(screen.getByText('650ms (High)')).toBeDefined();
  });

  it('renders custom network title when provided', () => {
    render(<NetworkLatencyIndicator pingMs={30} networkName="Soroban Public" />);
    expect(screen.getByText('Soroban Public')).toBeDefined();
  });
});
