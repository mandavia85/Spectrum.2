import { createContext, useContext, useEffect, useState } from 'react';
import { themes, DEFAULT_THEME } from '../config/themes';

const ThemeContext = createContext(null);
const STORAGE_KEY = 'erp_theme';

function applyTheme(key) {
  const theme = themes[key] || themes[DEFAULT_THEME];
  const root = document.documentElement;
  Object.entries(theme.vars).forEach(([prop, value]) => {
    root.style.setProperty(prop, value);
  });
  root.setAttribute('data-theme', key);
}

export function ThemeProvider({ children }) {
  const [themeKey, setThemeKey] = useState(() => localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME);

  useEffect(() => {
    applyTheme(themeKey);
    localStorage.setItem(STORAGE_KEY, themeKey);
  }, [themeKey]);

  return (
    <ThemeContext.Provider value={{ themeKey, setThemeKey, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
