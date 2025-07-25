import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { NotFoundPage } from '../pages/NotFoundPage/NotFoundPage';

describe('NotFoundPage', () => {
  const renderWithRouter = () => {
    const router = createMemoryRouter(
      [
        {
          path: '/404',
          element: <NotFoundPage />,
        },
        {
          path: '/',
          element: <div>Home Page</div>,
        },
      ],
      {
        initialEntries: ['/404'],
      },
    );
    return render(<RouterProvider router={router} />);
  };

  it('renders 404 error code', () => {
    renderWithRouter();
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('renders error title', () => {
    renderWithRouter();
    expect(screen.getByText('Oops! Page Not Found')).toBeInTheDocument();
  });

  it('renders humorous error messages', () => {
    renderWithRouter();
    expect(screen.getByText(/This website has many different pages/)).toBeInTheDocument();
    expect(screen.getByText(/Maybe such a page will be created someday/)).toBeInTheDocument();
    expect(
      screen.getByText(/Until then, why not explore what we actually have/),
    ).toBeInTheDocument();
  });

  it('renders home link with correct href', () => {
    renderWithRouter();
    const homeLink = screen.getByText('🏠 Take Me Home');
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('renders all expected emojis', () => {
    renderWithRouter();
    expect(screen.getByText(/🤷‍♂️/)).toBeInTheDocument();
    expect(screen.getByText(/✨/)).toBeInTheDocument();
    expect(screen.getByText(/😊/)).toBeInTheDocument();
    expect(screen.getByText(/🏠/)).toBeInTheDocument();
  });
});
