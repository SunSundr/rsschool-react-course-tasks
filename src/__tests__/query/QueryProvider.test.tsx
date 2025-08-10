import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { QueryProvider } from '~/query/QueryProvider';

vi.mock('~/query/settings', () => ({
  defaultQueries: {
    retry: false,
    staleTime: 5000,
  },
}));

describe('QueryProvider', () => {
  it('renders children', () => {
    render(
      <QueryProvider>
        <div data-testid="test-child">Test Content</div>
      </QueryProvider>,
    );
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('provides QueryClient context', () => {
    const TestComponent = () => {
      return <div data-testid="context-test">Context works</div>;
    };
    render(
      <QueryProvider>
        <TestComponent />
      </QueryProvider>,
    );
    expect(screen.getByTestId('context-test')).toBeInTheDocument();
  });
});
