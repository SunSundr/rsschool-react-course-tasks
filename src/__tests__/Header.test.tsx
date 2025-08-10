import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { APP_NAME } from '~/constants';
import { ThemeProvider } from '~/theme/ThemeContext';
import { Theme } from '~/types';
import { Header } from '../components/Header/Header';

const mockSetTheme = vi.fn();
const mockClearVideos = vi.fn();

vi.mock('~/store/store', () => ({
  useStore: () => ({
    clearVideos: mockClearVideos,
  }),
}));

vi.mock('~/hooks/useLocalStorage', () => ({
  useLocalStorage: () => [null, vi.fn()],
}));

vi.mock('~/context/useTheme', () => ({
  default: () => ({
    theme: Theme.Dark,
    setTheme: mockSetTheme,
  }),
}));

describe('Header', () => {
  const defaultProps = {
    updateContext: vi.fn(),
  };

  const renderWithRouter = (component: React.ReactElement) => {
    const router = createMemoryRouter([
      {
        path: '/',
        element: <ThemeProvider>{component}</ThemeProvider>,
      },
      {
        path: '/about',
        element: <div>About Page</div>,
      },
    ]);
    return render(<RouterProvider router={router} />);
  };

  it('renders header with logo and title', () => {
    renderWithRouter(<Header {...defaultProps} />);
    expect(screen.getByText(APP_NAME)).toBeInTheDocument();
    expect(screen.getByAltText('No image available')).toBeInTheDocument();
  });

  it('renders about link', () => {
    renderWithRouter(<Header {...defaultProps} />);
    const aboutLink = screen.getByText('About');
    expect(aboutLink).toBeInTheDocument();
    expect(aboutLink).toHaveAttribute('href', '/about');
  });

  it('calls updateContext when title button is clicked', async () => {
    const updateContext = vi.fn();
    renderWithRouter(<Header updateContext={updateContext} />);
    const titleButton = screen.getByText(APP_NAME);
    fireEvent.click(titleButton);
    await new Promise((resolve) => setTimeout(resolve, 400));
    expect(updateContext).toHaveBeenCalledOnce();
  });

  it('renders logo image with correct src', () => {
    renderWithRouter(<Header {...defaultProps} />);
    const logoImage = screen.getByAltText('No image available');
    expect(logoImage).toHaveAttribute('src', '/tmdb.png');
  });

  it('removes query parameter when it already exists', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: <Header {...defaultProps} />,
        },
      ],
      {
        initialEntries: ['/?q=popular'],
      },
    );
    render(<RouterProvider router={router} />);
    const titleButton = screen.getByText(APP_NAME);
    fireEvent.click(titleButton);
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(router.state.location.search).toBe('');
  });

  it('navigates to home when not on home or detailed page', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: <div>Home Page</div>,
        },
        {
          path: '/about',
          element: <Header {...defaultProps} />,
        },
      ],
      {
        initialEntries: ['/about'],
      },
    );
    render(<RouterProvider router={router} />);
    const titleButton = screen.getByText(APP_NAME);
    fireEvent.click(titleButton);
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(router.state.location.pathname).toBe('/');
  });

  it('toggles query parameter when on home page', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: <Header {...defaultProps} />,
        },
      ],
      {
        initialEntries: ['/'],
      },
    );
    render(<RouterProvider router={router} />);
    const titleButton = screen.getByText(APP_NAME);
    fireEvent.click(titleButton);
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(router.state.location.pathname).toBe('/');
    expect(router.state.location.search).toBe('?q=popular');
  });

  it('renders theme dropdown trigger', () => {
    renderWithRouter(<Header {...defaultProps} />);
    const themeDropdown = screen.getByRole('img', { hidden: true });
    expect(themeDropdown).toBeInTheDocument();
  });

  it('toggles dropdown when theme trigger is clicked', () => {
    const { container } = renderWithRouter(<Header {...defaultProps} />);
    const themeDropdown = container.querySelector('[class*="dropdownMenu"]');
    const dropdownContent = container.querySelector('[class*="dropdownContent"]');
    expect(dropdownContent?.className).not.toMatch(/show/);
    fireEvent.click(themeDropdown!);
    expect(dropdownContent?.className).toMatch(/show/);
  });

  it('calls setTheme when Dark theme is selected', () => {
    const { container } = renderWithRouter(<Header {...defaultProps} />);
    const themeDropdown = container.querySelector('[class*="dropdownMenu"]');
    fireEvent.click(themeDropdown!);
    const darkOption = screen.getByText('Dark');
    fireEvent.click(darkOption);
    expect(mockSetTheme).toHaveBeenCalledWith(Theme.Dark);
  });

  it('calls setTheme when Light theme is selected', () => {
    const { container } = renderWithRouter(<Header {...defaultProps} />);
    const themeDropdown = container.querySelector('[class*="dropdownMenu"]');
    fireEvent.click(themeDropdown!);
    const lightOption = screen.getByText('Light');
    fireEvent.click(lightOption);
    expect(mockSetTheme).toHaveBeenCalledWith(Theme.Light);
  });

  it('closes dropdown after theme selection', () => {
    const { container } = renderWithRouter(<Header {...defaultProps} />);
    const themeDropdown = container.querySelector('[class*="dropdownMenu"]');
    const dropdownContent = container.querySelector('[class*="dropdownContent"]');
    fireEvent.click(themeDropdown!);
    const darkOption = screen.getByText('Dark');
    fireEvent.click(darkOption);
    expect(dropdownContent?.className).not.toMatch(/show/);
  });
});
