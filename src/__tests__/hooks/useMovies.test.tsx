import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useMovies } from '~/hooks/useMovies';
import { fetchMovies } from '~/services/movieService';
import { TMDBSearchResult, TMDBVideo } from '~/types';

vi.mock('~/services/movieService');
vi.mock('~/query/settings', () => ({
  QueryKeys: {
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

describe('useMovies', () => {
  const mockResult: TMDBSearchResult = {
    page: 1,
    results: [{ id: 1, title: 'Test Movie' } as TMDBVideo],
    total_pages: 1,
    total_results: 1,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(fetchMovies).mockResolvedValue(mockResult);
  });

  it('fetches movies with query and page', async () => {
    const { result } = renderHook(() => useMovies('batman', 1), {
      wrapper: createWrapper(),
    });
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.data).toEqual(mockResult);
    expect(fetchMovies).toHaveBeenCalledWith('batman', 1);
  });

  it('handles empty query', async () => {
    const { result } = renderHook(() => useMovies('', 1), {
      wrapper: createWrapper(),
    });
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(fetchMovies).toHaveBeenCalledWith('', 1);
  });

  it('handles error state', async () => {
    const error = new Error('Fetch failed');
    vi.mocked(fetchMovies).mockRejectedValue(error);
    const { result } = renderHook(() => useMovies('batman', 1), {
      wrapper: createWrapper(),
    });
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
    expect(result.current.error).toEqual(error);
  });

  it('returns loading state initially', () => {
    const { result } = renderHook(() => useMovies('batman', 1), {
      wrapper: createWrapper(),
    });
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });
});
