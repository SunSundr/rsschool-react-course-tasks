import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TASK } from '~/constants';
import { AboutPage } from '../pages/About/AboutPage';

vi.mock('~/constants', () => ({
  TASK: {
    avatar: '/test-avatar.jpg',
  },
}));

describe('AboutPage', () => {
  const renderWithRouter = () => {
    const router = createMemoryRouter(
      [
        {
          path: '/about',
          element: <AboutPage />,
        },
        {
          path: '/',
          element: <div>Home Page</div>,
        },
      ],
      {
        initialEntries: ['/about'],
      },
    );
    return render(<RouterProvider router={router} />);
  };

  it('renders personal information', () => {
    renderWithRouter();
    expect(screen.getByText('About Me')).toBeInTheDocument();
    expect(screen.getByText('Aleksandr Kovalenko')).toBeInTheDocument();
    expect(screen.getByText('SunSundr')).toBeInTheDocument();
    expect(screen.getByText('Beginner Fullstack Developer')).toBeInTheDocument();
  });

  it('renders avatar image', () => {
    renderWithRouter();
    const avatar = screen.getByAltText('Aleksandr Kovalenko');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', '/test-avatar.jpg');
  });

  it('renders humorous description paragraphs', () => {
    renderWithRouter();
    expect(
      screen.getByText(/Hello! I'm Aleksandr, a passionate beginner fullstack developer/),
    ).toBeInTheDocument();
    expect(screen.getByText(/I love programming because it's the only place/)).toBeInTheDocument();
    expect(screen.getByText(/When I'm not coding, I enjoy having a good time/)).toBeInTheDocument();
  });

  it('renders RS School course link', () => {
    renderWithRouter();
    const courseLink = screen.getByText('RS School React course');
    expect(courseLink).toBeInTheDocument();
    expect(courseLink).toHaveAttribute('href', TASK.course);
    expect(courseLink).toHaveAttribute('target', '_blank');
  });

  it('renders task requirements link', () => {
    renderWithRouter();
    const taskLink = screen.getByText('📚 View Task Requirements');
    expect(taskLink).toBeInTheDocument();
    expect(taskLink).toHaveAttribute('href', TASK.task);
    expect(taskLink).toHaveAttribute('target', '_blank');
  });

  it('renders close button and navigates home when clicked', () => {
    const { container } = renderWithRouter();
    const closeButton = container.querySelector('button');
    expect(closeButton).toBeInTheDocument();

    fireEvent.click(closeButton!);
    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });

  it('renders emojis in content', () => {
    renderWithRouter();
    expect(screen.getByText(/🌊/)).toBeInTheDocument();
    expect(screen.getByText(/🦆/)).toBeInTheDocument();
    expect(screen.getByText(/😅/)).toBeInTheDocument();
    expect(screen.getByText(/📚/)).toBeInTheDocument();
  });
});
