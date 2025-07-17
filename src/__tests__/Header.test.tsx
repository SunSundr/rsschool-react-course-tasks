import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { APP_NAME, TASK } from '~/constants';
import { Header } from '../components/Header/Header';

describe('Header', () => {
  const defaultProps = {
    updateContext: vi.fn(),
  };

  it('renders header with logo and title', () => {
    render(<Header {...defaultProps} />);
    expect(screen.getByText(APP_NAME)).toBeInTheDocument();
    expect(screen.getByAltText('No image available')).toBeInTheDocument();
  });

  it('renders task link', () => {
    render(<Header {...defaultProps} />);
    const taskLink = screen.getByText(TASK.title);
    expect(taskLink).toBeInTheDocument();
    expect(taskLink).toHaveAttribute('href', TASK.url);
  });

  it('calls updateSearch when title button is clicked', () => {
    const updateSearch = vi.fn();
    render(<Header {...defaultProps} updateContext={updateSearch} />);
    const titleButton = screen.getByText(APP_NAME);
    fireEvent.click(titleButton);
    expect(updateSearch).toHaveBeenCalledOnce();
  });

  it('renders logo image with correct src', () => {
    render(<Header {...defaultProps} />);
    const logoImage = screen.getByAltText('No image available');
    expect(logoImage).toHaveAttribute('src', '/tmdb.png');
  });
});
