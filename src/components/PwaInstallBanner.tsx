import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PwaInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if dismissed in this session
    if (typeof window !== 'undefined' && sessionStorage.getItem('pwa_prompt_dismissed')) {
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('pwa_prompt_dismissed', 'true');
    }
  };

  if (!isVisible || !deferredPrompt) {
    return null;
  }

  return (
    <div
      role="banner"
      aria-label="Install Stellar Music Progressive Web App"
      className="fixed bottom-24 right-4 z-50 flex max-w-sm items-center gap-3 rounded-xl border border-cyan-500/30 bg-slate-900/95 p-3.5 shadow-2xl backdrop-blur-md"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
        <Download className="h-5 w-5" />
      </div>
      <div className="flex-1 text-xs">
        <p className="font-semibold text-slate-100">Install Stellar Music</p>
        <p className="text-slate-400">Add to your home screen for instant playback.</p>
      </div>
      <div className="flex items-center gap-1.5">
        <button
          onClick={handleInstallClick}
          className="rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:from-cyan-400 hover:to-blue-500 transition-all"
        >
          Install
        </button>
        <button
          onClick={handleDismiss}
          aria-label="Dismiss install prompt"
          className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
