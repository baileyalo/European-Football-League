import { useState, useEffect, useCallback } from 'react';

export function useTheme() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const toggle = useCallback(() => setIsDarkMode((prev) => !prev), []);

  useEffect(() => {
    const theme = isDarkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem('theme', theme);

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', isDarkMode ? '#0f172a' : '#f3f4f6');
    }
  }, [isDarkMode]);

  return { isDarkMode, toggleTheme: toggle };
}
