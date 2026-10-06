import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { WalletProvider } from './context/WalletContext';
import { PlayerProvider } from './context/PlayerContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WalletProvider>
      <PlayerProvider>
        <App />
      </PlayerProvider>
    </WalletProvider>
  </React.StrictMode>
);
