import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Empty from '../components/Empty/Empty';

describe('Empty', () => {
  it('renders sorry message', () => {
    render(<Empty />);
    expect(screen.getByText('Sorry, nothing was found...')).toBeInTheDocument();
  });

  it('renders a search tip', () => {
    render(<Empty />);
    const tipElement = screen.getByText(/Try searching for/);
    expect(tipElement).toBeInTheDocument();
  });

  it('renders one of the predefined tips', () => {
    render(<Empty />);
    const possibleTips = [
      'Try searching for "Avengers"',
      'Try searching for "Batman"',
      'Try searching for "Star Wars"',
      'Try searching for "Marvel"',
      'Try searching for "Disney"',
      'Try searching for "Comedy"',
      'Try searching for "Action"',
      'Try searching for "Horror"',
    ];
    const tipText = screen.getByText(/Try searching for/).textContent;
    expect(possibleTips).toContain(tipText);
  });

  it('renders different tips on multiple renders', () => {
    vi.spyOn(Math, 'random').mockReturnValueOnce(0).mockReturnValueOnce(0.9);
    const { unmount } = render(<Empty />);
    const firstTip = screen.getByText(/Try searching for/).textContent;
    unmount();
    render(<Empty />);
    const secondTip = screen.getByText(/Try searching for/).textContent;
    expect(firstTip).toBe('Try searching for "Avengers"');
    expect(secondTip).toBe('Try searching for "Horror"');
    vi.restoreAllMocks();
  });

  it('renders title as h3 element', () => {
    render(<Empty />);
    const title = screen.getByRole('heading', { level: 3 });
    expect(title).toHaveTextContent('Sorry, nothing was found...');
  });
});
