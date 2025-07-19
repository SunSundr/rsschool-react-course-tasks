import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ErrorButton } from '../components/ErrorButton/ErrorButton';

describe('ErrorButton', () => {
  it('renders button with correct text', () => {
    render(<ErrorButton />);
    expect(screen.getByText('Error Button')).toBeInTheDocument();
  });

  it('renders button with correct type', () => {
    render(<ErrorButton />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('throws error when clicked', () => {
    render(<ErrorButton />);
    const button = screen.getByText('Error Button');

    expect(() => {
      fireEvent.click(button);
    }).toThrow(/Custom error generated at/);
  });

  it('throws error with timestamp', () => {
    render(<ErrorButton />);
    const button = screen.getByText('Error Button');

    expect(() => {
      fireEvent.click(button);
    }).toThrow(Error);
  });
});
