'use client';

import { useContext } from 'react';
import { ThemeContext } from './ThemeProvider';

const useThemeNext = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useThemeNext must be used within a ThemeProvider');

  return context;
};

export default useThemeNext;
