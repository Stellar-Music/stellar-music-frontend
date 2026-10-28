import React, { useState } from 'react';
import { AlertTriangle, ExternalLink, X } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

export const NetworkBanner: React.FC = () => {
  const { isConnected, walletType } = useWallet();
  const [dismissed, setDismissed] = useState(false);

  if (!isConnected || dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 border-b border-amber-500/30 px-4 py-2 text-xs text-amber-200 flex items-center justify-between">
      <div className="flex items-center gap-2 max-w-4xl mx-auto">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
        <span>
          <strong>Stellar Testnet Active:</strong> Ensure your{' '}
          {walletType === 'freighter' ? 'Freighter wallet' : 'Demo account'} is connected to{' '}
          <span className="underline font-semibold">Testnet</span> to test streaming passes and revenue splits without real funds.
        </span>
        <a
          href="https://laboratory.stellar.org/#account-creator?network=test"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-amber-300 hover:text-white underline font-medium ml-2"
        >
          Friendbot Faucet <ExternalLink className="w-3 h-3" />
        </a>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-amber-400 hover:text-amber-200 p-1 rounded transition-colors"
        aria-label="Dismiss banner"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
