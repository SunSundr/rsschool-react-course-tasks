import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ThemeProvider } from '~/theme/ThemeContext';
import useTheme from '~/theme/useTheme';
import { Theme } from '~/types';

vi.mock('~/store/store', () => ({
  useStore: () => ({
    theme: Theme.Dark,
    setTheme: vi.fn(),
  }),
}));

vi.mock('~/hooks/useLocalStorage', () => ({
  useLocalStorage: () => [null, vi.fn()],
}));

describe('useTheme', () => {
  it('returns theme context when used within ThemeProvider', () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    expect(result.current.theme).toBe(Theme.Dark);
    expect(typeof result.current.setTheme).toBe('function');
  });

  it('returns default context when used outside ThemeProvider', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe(Theme.Light);
    expect(typeof result.current.setTheme).toBe('function');
  });
});
