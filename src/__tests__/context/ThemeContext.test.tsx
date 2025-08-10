import { useContext } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ThemeContext, ThemeProvider } from '~/theme/ThemeContext';
import { Theme } from '~/types';

const mockSetTheme = vi.fn();
const mockSetThemeLS = vi.fn();

vi.mock('~/store/store', () => ({
  useStore: () => ({
    theme: Theme.Light,
    setTheme: mockSetTheme,
  }),
}));

vi.mock('~/hooks/useLocalStorage', () => ({
  useLocalStorage: () => [null, mockSetThemeLS],
}));

const TestComponent = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={() => setTheme(Theme.Dark)}>Set Dark</button>
      <button onClick={() => setTheme(Theme.Light)}>Set Light</button>
    </div>
  );
};

describe('ThemeContext', () => {
  it('provides theme value from store', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );
    expect(screen.getByTestId('theme')).toHaveTextContent(Theme.Light);
  });

  it('calls setTheme and localStorage when theme is changed', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );
    fireEvent.click(screen.getByText('Set Dark'));
    expect(mockSetTheme).toHaveBeenCalledWith(Theme.Dark);
    expect(mockSetThemeLS).toHaveBeenCalledWith(Theme.Dark);
  });

  it('calls setTheme and localStorage for light theme', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );
    fireEvent.click(screen.getByText('Set Light'));
    expect(mockSetTheme).toHaveBeenCalledWith(Theme.Light);
    expect(mockSetThemeLS).toHaveBeenCalledWith(Theme.Light);
  });
});
