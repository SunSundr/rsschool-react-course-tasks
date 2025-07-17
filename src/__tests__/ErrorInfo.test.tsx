import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ErrorInfo } from '../components/ErrorInfo/ErrorInfo';

describe('ErrorInfo', () => {
  it('renders error title', () => {
    render(<ErrorInfo message="Test error message" />);
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('renders error message', () => {
    render(<ErrorInfo message="Test error message" />);
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('renders title as h3 element', () => {
    render(<ErrorInfo message="Test error message" />);
    const title = screen.getByRole('heading', { level: 3 });
    expect(title).toHaveTextContent('Error');
  });

  it('renders different error messages', () => {
    const { rerender } = render(<ErrorInfo message="First error" />);
    expect(screen.getByText('First error')).toBeInTheDocument();

    rerender(<ErrorInfo message="Second error" />);
    expect(screen.getByText('Second error')).toBeInTheDocument();
    expect(screen.queryByText('First error')).not.toBeInTheDocument();
  });

  it('handles empty message', () => {
    render(<ErrorInfo message="" />);
    expect(screen.getByText('Error')).toBeInTheDocument();
    const messageElement = screen.getByText('Error').nextElementSibling;
    expect(messageElement).toHaveTextContent('');
  });
});
