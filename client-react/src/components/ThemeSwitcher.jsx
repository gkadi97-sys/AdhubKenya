import { useState, useEffect } from 'react';

const themes = [
  { id: 'dark', label: 'Dark', icon: '🌙' },
  { id: 'light', label: 'Light', icon: '☀️' },
  { id: 'minimal', label: 'Minimal', icon: '☁️' },
  { id: 'sepia', label: 'Sepia', icon: '📜' },
  { id: 'blush', label: 'Blush', icon: '🌸' }
];

export default function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('theme') || 'light';
    setCurrentTheme(stored);
  }, []);

  const changeTheme = (themeId) => {
    setCurrentTheme(themeId);
    localStorage.setItem('theme', themeId);
    if (themeId === 'dark') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', themeId);
    }
  };

  const currentThemeObj = themes.find(t => t.id === currentTheme) || themes[1];

  const toggleTheme = () => {
    const currentIndex = themes.findIndex(t => t.id === currentTheme);
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % themes.length;
    changeTheme(themes[nextIndex].id);
  };

  if (!mounted) return <div style={{width: 32, height: 32}} />; // Placeholder to avoid layout shift

  return (
    <button
      onClick={toggleTheme}
      className="theme-switcher-btn"
      title={`Switch theme (current: ${currentThemeObj.label})`}
      style={{
        background: 'var(--surface-2)',
        border: '1px solid var(--border)',
        color: 'var(--text)',
        padding: '6px 12px',
        borderRadius: 'var(--radius-full)',
        fontSize: '1rem',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease'
      }}
    >
      {currentThemeObj.icon}
    </button>
  );
}
