import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'midnight'>(() => {
    return (localStorage.getItem('stellar_music_theme') as 'dark' | 'midnight') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('stellar_music_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'midnight' : 'dark'));
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="btn-icon"
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '50%',
        width: '36px',
        height: '36px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme === 'dark' ? 'var(--accent-amber)' : 'var(--accent-cyan)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
      title={`Switch to ${theme === 'dark' ? 'High-Contrast Midnight' : 'Deep Space Dark'} theme`}
      aria-label="Toggle visual theme"
    >
      {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  );
};
