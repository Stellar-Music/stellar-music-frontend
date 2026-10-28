import React from 'react';
import { X, Keyboard, Command } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutItem {
  keyCombo: string[];
  description: string;
  category: 'Playback' | 'Navigation' | 'General';
}

const SHORTCUTS: ShortcutItem[] = [
  { keyCombo: ['Space'], description: 'Toggle Play / Pause audio playback', category: 'Playback' },
  { keyCombo: ['M'], description: 'Toggle volume mute / unmute', category: 'Playback' },
  { keyCombo: ['←'], description: 'Seek backward 5 seconds', category: 'Playback' },
  { keyCombo: ['→'], description: 'Seek forward 5 seconds', category: 'Playback' },
  { keyCombo: ['R'], description: 'Cycle repeat mode (Off, All, Single Track)', category: 'Playback' },
  { keyCombo: ['N'], description: 'Skip to next track in playback queue', category: 'Navigation' },
  { keyCombo: ['P'], description: 'Return to previous track or track start', category: 'Navigation' },
  { keyCombo: ['?'], description: 'Open this keyboard shortcuts cheatsheet', category: 'General' },
  { keyCombo: ['Esc'], description: 'Dismiss any active modal or menu', category: 'General' },
];

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 140,
        backgroundColor: 'rgba(5, 7, 15, 0.85)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '540px',
          padding: '28px',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: '#0d1122',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
          }}
          aria-label="Close shortcuts modal"
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'rgba(0, 242, 254, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Keyboard size={22} color="var(--accent-cyan)" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Keyboard Shortcuts</h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Fast web3 music navigation and playback controls
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {SHORTCUTS.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <span style={{ fontSize: '0.86rem', color: 'var(--text-primary)' }}>
                {item.description}
              </span>
              <div style={{ display: 'flex', gap: '4px' }}>
                {item.keyCombo.map((k, kIdx) => (
                  <kbd
                    key={kIdx}
                    style={{
                      backgroundColor: 'rgba(0, 242, 254, 0.12)',
                      border: '1px solid rgba(0, 242, 254, 0.35)',
                      color: 'var(--accent-cyan)',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '0.78rem',
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      boxShadow: '0 2px 0 rgba(0, 0, 0, 0.4)',
                    }}
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: '18px',
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.76rem',
            color: 'var(--text-muted)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Command size={14} />
            <span>Press <kbd style={{ padding: '1px 5px', borderRadius: '3px', background: 'rgba(255,255,255,0.1)' }}>?</kbd> anywhere to toggle this cheatsheet.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
