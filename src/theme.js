import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const THEME_STORAGE_KEY = 'porto-web-theme-mode';
const ThemeContext = createContext(null);

const getSystemTheme = () => {
  if (typeof window === 'undefined' || !window.matchMedia) return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('system');
  const [systemTheme, setSystemTheme] = useState(getSystemTheme);
  const [swipe, setSwipe] = useState({ active: false, targetTheme: 'dark', token: 0 });

  useEffect(() => {
    const storedMode = localStorage.getItem(THEME_STORAGE_KEY);
    if (storedMode === 'light' || storedMode === 'dark' || storedMode === 'system') {
      setMode(storedMode);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  }, [mode]);

  useEffect(() => {
    if (!window.matchMedia) return undefined;

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => setSystemTheme(media.matches ? 'dark' : 'light');

    handleChange();
    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, []);

  const theme = mode === 'system' ? systemTheme : mode;

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-dark');
    root.classList.add(theme === 'light' ? 'theme-light' : 'theme-dark');
    root.style.colorScheme = theme;
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    if (swipe.active) root.classList.add('theme-switching');
    else root.classList.remove('theme-switching');
  }, [swipe.active]);

  const value = useMemo(
    () => ({
      mode,
      theme,
      setMode,
      setModeManual: (nextMode) => {
        const resolvedCurrent = mode === 'system' ? systemTheme : mode;
        const resolvedNext = nextMode === 'system' ? systemTheme : nextMode;

        if (nextMode === mode) return;
        if (resolvedCurrent === resolvedNext) {
          setMode(nextMode);
          return;
        }

        const token = Date.now();
        setSwipe({ active: true, targetTheme: resolvedNext, token });

        window.setTimeout(() => {
          setMode(nextMode);
        }, 180);

        window.setTimeout(() => {
          setSwipe((current) => (current.token === token ? { ...current, active: false } : current));
        }, 560);
      },
      cycleMode: () => {
        setMode((prev) => {
          if (prev === 'system') return 'light';
          if (prev === 'light') return 'dark';
          return 'system';
        });
      },
    }),
    [mode, theme, systemTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
      {swipe.active && <div className={`theme-swipe-overlay ${swipe.targetTheme === 'light' ? 'to-light' : 'to-dark'}`} aria-hidden="true" />}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
