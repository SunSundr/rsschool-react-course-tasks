import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders loading text', () => {
    render(<LoadingSpinner />);
    expect(screen.getByText('LOADING')).toBeInTheDocument();
  });

  it('renders component structure', () => {
    const { container } = render(<LoadingSpinner />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with overlay prop', () => {
    render(<LoadingSpinner overlay={true} />);
    expect(screen.getByText('LOADING')).toBeInTheDocument();
  });
});
