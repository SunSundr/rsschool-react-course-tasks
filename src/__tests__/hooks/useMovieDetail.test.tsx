import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useMovieDetail } from '~/hooks/useMovieDetail';
import { fetchDetailMovie } from '~/services/movieService';
import { createMockVideo } from '../common';

vi.mock('~/services/movieService');
vi.mock('~/query/settings', () => ({
  QueryKeys: {
    movie: 'movie',
    movies: 'movies',
  },
  delayLoading: vi.fn(() => Promise.resolve()),
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

describe('useMovieDetail', () => {
  const mockMovie = createMockVideo({ id: 123 });

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(fetchDetailMovie).mockResolvedValue(mockMovie);
  });

  it('fetches movie detail when id is provided', async () => {
    const { result } = renderHook(() => useMovieDetail('123'), {
      wrapper: createWrapper(),
    });
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.data).toEqual(mockMovie);
    expect(fetchDetailMovie).toHaveBeenCalledWith('123');
  });

  it('does not fetch when id is empty', () => {
    const { result } = renderHook(() => useMovieDetail(''), {
      wrapper: createWrapper(),
    });
    expect(result.current.isLoading).toBe(false);
    expect(fetchDetailMovie).not.toHaveBeenCalled();
  });

  it('handles error state', async () => {
    const error = new Error('Fetch failed');
    vi.mocked(fetchDetailMovie).mockRejectedValue(error);
    const { result } = renderHook(() => useMovieDetail('123'), {
      wrapper: createWrapper(),
    });
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
    expect(result.current.error).toEqual(error);
  });

  it('returns loading state initially', () => {
    const { result } = renderHook(() => useMovieDetail('123'), {
      wrapper: createWrapper(),
    });
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });
});
