import React, { createContext, useContext, useState, useEffect } from 'react';
import * as StellarSdk from '@stellar/stellar-sdk';
import { stellarClient } from '../services/stellar';

interface WalletContextType {
  address: string | null;
  balance: string;
  isConnected: boolean;
  isConnecting: boolean;
  walletType: 'freighter' | 'keypair' | null;
  keypair?: StellarSdk.Keypair;
  error: string | null;
  connectFreighter: () => Promise<void>;
  connectDemoKeypair: () => Promise<void>;
  disconnect: () => void;
  refreshBalance: () => Promise<void>;
  fundWithFriendbot: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [walletType, setWalletType] = useState<'freighter' | 'keypair' | null>(null);
  const [keypair, setKeypair] = useState<StellarSdk.Keypair | undefined>(undefined);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Restore session
  useEffect(() => {
    const savedType = localStorage.getItem('stellar_music_wallet_type');
    if (savedType === 'keypair') {
      connectDemoKeypair();
    } else if (savedType === 'freighter') {
      connectFreighter();
    }
  }, []);

  const refreshBalance = async () => {
    if (!address) return;
    try {
      const bal = await stellarClient.getBalance(address);
      setBalance(bal);
    } catch {
      // Ignore balance refresh error
    }
  };

  useEffect(() => {
    if (address) {
      refreshBalance();
      const interval = setInterval(refreshBalance, 12000);
      return () => clearInterval(interval);
    }
  }, [address]);

  const connectFreighter = async () => {
    setIsConnecting(true);
    setError(null);
    try {
      const addr = await stellarClient.connectFreighter();
      setAddress(addr);
      setWalletType('freighter');
      setKeypair(undefined);
      localStorage.setItem('stellar_music_wallet_type', 'freighter');
      const bal = await stellarClient.getBalance(addr);
      setBalance(bal);
    } catch (err: any) {
      setError(err.message || 'Failed to connect Freighter.');
      throw err;
    } finally {
      setIsConnecting(false);
    }
  };

  const connectDemoKeypair = async () => {
    setIsConnecting(true);
    setError(null);
    try {
      const kp = stellarClient.getOrCreateDemoKeypair();
      const addr = kp.publicKey();
      setKeypair(kp);
      setAddress(addr);
      setWalletType('keypair');
      localStorage.setItem('stellar_music_wallet_type', 'keypair');

      let bal = await stellarClient.getBalance(addr);
      // Auto-fund demo keypair if unfunded
      if (bal === '0 (Unfunded)' || bal === '0') {
        try {
          await stellarClient.fundWithFriendbot(addr);
          bal = await stellarClient.getBalance(addr);
        } catch {
          // ignore auto-fund error
        }
      }
      setBalance(bal);
    } catch (err: any) {
      setError(err.message || 'Failed to initialize demo keypair.');
      throw err;
    } finally {
      setIsConnecting(false);
    }
  };

  const fundWithFriendbot = async () => {
    if (!address) return;
    setIsConnecting(true);
    try {
      await stellarClient.fundWithFriendbot(address);
      await refreshBalance();
    } catch (err: any) {
      setError(err.message || 'Funding failed');
      throw err;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setAddress(null);
    setBalance('0');
    setWalletType(null);
    setKeypair(undefined);
    localStorage.removeItem('stellar_music_wallet_type');
  };

  return (
    <WalletContext.Provider
      value={{
        address,
        balance,
        isConnected: !!address,
        isConnecting,
        walletType,
        keypair,
        error,
        connectFreighter,
        connectDemoKeypair,
        disconnect,
        refreshBalance,
        fundWithFriendbot,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
