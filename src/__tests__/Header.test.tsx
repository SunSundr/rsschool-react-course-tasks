import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { APP_NAME } from '~/constants';
import { Header } from '../components/Header/Header';

describe('Header', () => {
  const defaultProps = {
    updateContext: vi.fn(),
  };

  const renderWithRouter = (component: React.ReactElement) => {
    const router = createMemoryRouter([
      {
        path: '/',
        element: component,
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
});
