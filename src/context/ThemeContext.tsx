import React, { createContext } from 'react';
import { LS_THEME_KEY } from '~/constants';
import { useLocalStorage } from '~/hooks/useLocalStorage';
import { useStore } from '~/store/store';
import { Theme, ThemeType } from '~/types';

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: Theme.Light,
  setTheme: (_: ThemeType) => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, setTheme } = useStore();
  const [, setThemeLS] = useLocalStorage(LS_THEME_KEY, '');
  const setThemeWithLS = (theme: ThemeType) => {
    setTheme(theme);
    setThemeLS(theme);
  };
  return (
    <ThemeContext.Provider value={{ theme, setTheme: setThemeWithLS }}>
      {children}
    </ThemeContext.Provider>
  );
};
