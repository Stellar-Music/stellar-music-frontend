import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import React from 'react';
import { WalletProvider, useWallet } from './WalletContext';

// Self-contained in-memory storage mock
const storageMap = new Map<string, string>();
const localStorageMock = {
  getItem: (key: string) => storageMap.get(key) || null,
  setItem: (key: string, value: string) => storageMap.set(key, String(value)),
  removeItem: (key: string) => storageMap.delete(key),
  clear: () => storageMap.clear(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock, writable: true });

// Mock stellarClient using self-contained inline object
vi.mock('../services/stellar', () => {
  return {
    stellarClient: {
      isFreighterInstalled: vi.fn().mockResolvedValue(true),
      connectFreighter: vi.fn().mockResolvedValue('GBCG2X7MBTQFBHCYJ4UQSZ7XSZR7L4TUQIVA624SCLDLUF23MABAPIPG'),
      getOrCreateDemoKeypair: vi.fn().mockReturnValue({
        publicKey: () => 'GBCG2X7MBTQFBHCYJ4UQSZ7XSZR7L4TUQIVA624SCLDLUF23MABAPIPG',
        secret: () => 'SCZANGBA5YHTNYVVV4C3U252E2B6P6F5T3U64MM6CSFTN2YR7C2OJ3GV',
      }),
      getBalance: vi.fn().mockResolvedValue('100.00'),
      fundWithFriendbot: vi.fn().mockResolvedValue(undefined),
      payForMusicPass: vi.fn().mockResolvedValue({ hash: 'tx123', ledger: 100 }),
    },
  };
});

const TestConsumer: React.FC = () => {
  const { address, isConnected, walletType, balance, connectDemoKeypair, disconnect } = useWallet();

  return (
    <div>
      <span data-testid="status">{isConnected ? 'CONNECTED' : 'DISCONNECTED'}</span>
      <span data-testid="address">{address || 'NONE'}</span>
      <span data-testid="walletType">{walletType || 'NONE'}</span>
      <span data-testid="balance">{balance}</span>
      <button onClick={() => connectDemoKeypair()} data-testid="btn-demo">
        Connect Demo
      </button>
      <button onClick={() => disconnect()} data-testid="btn-disconnect">
        Disconnect
      </button>
    </div>
  );
};

describe('WalletContext state transitions', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('initializes with disconnected state', () => {
    render(
      <WalletProvider>
        <TestConsumer />
      </WalletProvider>
    );

    expect(screen.getByTestId('status').textContent).toBe('DISCONNECTED');
    expect(screen.getByTestId('address').textContent).toBe('NONE');
    expect(screen.getByTestId('walletType').textContent).toBe('NONE');
    expect(screen.getByTestId('balance').textContent).toBe('0');
  });

  it('connects demo keypair and updates state', async () => {
    render(
      <WalletProvider>
        <TestConsumer />
      </WalletProvider>
    );

    await act(async () => {
      screen.getByTestId('btn-demo').click();
    });

    expect(screen.getByTestId('status').textContent).toBe('CONNECTED');
    expect(screen.getByTestId('walletType').textContent).toBe('keypair');
    expect(screen.getByTestId('address').textContent).toBe(
      'GBCG2X7MBTQFBHCYJ4UQSZ7XSZR7L4TUQIVA624SCLDLUF23MABAPIPG'
    );
    expect(localStorageMock.getItem('stellar_music_wallet_type')).toBe('keypair');
  });

  it('disconnects and clears state properly', async () => {
    render(
      <WalletProvider>
        <TestConsumer />
      </WalletProvider>
    );

    await act(async () => {
      screen.getByTestId('btn-demo').click();
    });

    expect(screen.getByTestId('status').textContent).toBe('CONNECTED');

    await act(async () => {
      screen.getByTestId('btn-disconnect').click();
    });

    expect(screen.getByTestId('status').textContent).toBe('DISCONNECTED');
    expect(screen.getByTestId('address').textContent).toBe('NONE');
    expect(screen.getByTestId('walletType').textContent).toBe('NONE');
    expect(localStorageMock.getItem('stellar_music_wallet_type')).toBeNull();
  });
});
