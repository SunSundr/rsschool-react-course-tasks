import { StateCreator } from 'zustand';
import { LS_THEME_KEY } from '~/constants';
import { Theme, ThemeType } from '~/types';

export interface ThemeSlice {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

const getDefaultTheme = (): ThemeType => {
  if (typeof window === 'undefined') return Theme.Light;
  const savedTheme = localStorage.getItem(LS_THEME_KEY);
  if (savedTheme) {
    try {
      return JSON.parse(savedTheme);
    } catch {
      localStorage.removeItem(LS_THEME_KEY);
    }
  }
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  return mediaQuery.matches ? Theme.Dark : Theme.Light;
};

export const createThemeSlice: StateCreator<ThemeSlice> = (set) => ({
  theme: getDefaultTheme(),
  setTheme: (theme) => set({ theme }),
});
