import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useResetQueries } from '~/hooks/useRefreshData';

vi.mock('~/query/settings', () => ({
  QueryKeys: {
    movie: 'movie',
    movies: 'movies',
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  const queryProvider = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return queryProvider;
};

describe('useResetQueries', () => {
  it('returns resetMovieQueries and resetMoviesQueries functions', () => {
    const { result } = renderHook(() => useResetQueries(), {
      wrapper: createWrapper(),
    });
    expect(typeof result.current.resetMovieQueries).toBe('function');
    expect(typeof result.current.resetMoviesQueries).toBe('function');
  });

  it('resetMovieQueries does nothing when id is undefined', async () => {
    const { result } = renderHook(() => useResetQueries(), {
      wrapper: createWrapper(),
    });
    await expect(result.current.resetMovieQueries(undefined)).resolves.toBeUndefined();
  });

  it('resetMovieQueries works with valid id', async () => {
    const { result } = renderHook(() => useResetQueries(), {
      wrapper: createWrapper(),
    });
    await expect(result.current.resetMovieQueries(123)).resolves.toBeUndefined();
  });

  it('resetMoviesQueries works', async () => {
    const { result } = renderHook(() => useResetQueries(), {
      wrapper: createWrapper(),
    });
    await expect(result.current.resetMoviesQueries()).resolves.toBeUndefined();
  });
});
