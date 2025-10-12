import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeContextType {
  themeColor: string;
  fontSize: string;
  setThemeColor: (color: string) => void;
  setFontSize: (size: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themeColorMap: Record<string, { primary: string; secondary: string; gradient: string }> = {
  blue: {
    primary: 'rgb(59, 130, 246)', // blue-500
    secondary: 'rgb(6, 182, 212)', // cyan-500
    gradient: 'linear-gradient(to right, rgb(59, 130, 246), rgb(6, 182, 212))',
  },
  green: {
    primary: 'rgb(34, 197, 94)', // green-500
    secondary: 'rgb(16, 185, 129)', // emerald-500
    gradient: 'linear-gradient(to right, rgb(34, 197, 94), rgb(16, 185, 129))',
  },
  orange: {
    primary: 'rgb(249, 115, 22)', // orange-500
    secondary: 'rgb(251, 146, 60)', // orange-400
    gradient: 'linear-gradient(to right, rgb(249, 115, 22), rgb(251, 146, 60))',
  },
  red: {
    primary: 'rgb(239, 68, 68)', // red-500
    secondary: 'rgb(248, 113, 113)', // red-400
    gradient: 'linear-gradient(to right, rgb(239, 68, 68), rgb(248, 113, 113))',
  },
  cyan: {
    primary: 'rgb(6, 182, 212)', // cyan-500
    secondary: 'rgb(34, 211, 238)', // cyan-400
    gradient: 'linear-gradient(to right, rgb(6, 182, 212), rgb(34, 211, 238))',
  },
};

const fontSizeMap: Record<string, string> = {
  Small: '14px',
  Medium: '16px',
  Large: '18px',
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeColor, setThemeColorState] = useState(() => {
    return localStorage.getItem('themeColor') || 'blue';
  });

  const [fontSize, setFontSizeState] = useState(() => {
    return localStorage.getItem('fontSize') || 'Medium';
  });

  const setThemeColor = (color: string) => {
    setThemeColorState(color);
    localStorage.setItem('themeColor', color);
  };

  const setFontSize = (size: string) => {
    setFontSizeState(size);
    localStorage.setItem('fontSize', size);
  };

  useEffect(() => {
    const colors = themeColorMap[themeColor];
    const root = document.documentElement;

    // Set CSS variables for theme colors
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-secondary', colors.secondary);
    root.style.setProperty('--gradient-primary', colors.gradient);

    // Update meta theme color for mobile browsers
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', colors.primary);
    }
  }, [themeColor]);

  useEffect(() => {
    const root = document.documentElement;
    const baseFontSize = fontSizeMap[fontSize];
    root.style.fontSize = baseFontSize;
  }, [fontSize]);

  return (
    <ThemeContext.Provider value={{ themeColor, fontSize, setThemeColor, setFontSize }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

