import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggleButton = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-1000 px-4 py-2 rounded-kiosk bg-primary-500 text-white shadow-kiosk-lg hover:bg-primary-600 transition-all"
      aria-label="Toggle dark and light theme"
    >
      {isDark ? '☀️ Light' : '🌙 Dark'}
    </button>
  );
};

export default ThemeToggleButton;
