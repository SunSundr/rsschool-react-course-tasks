import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useImagesConfig } from '~/hooks/useImagesConfig';
import { fetchImagesConfig } from '~/services/movieService';
import { mockImageConfig } from '../common';

vi.mock('~/services/movieService');
vi.mock('~/query/settings', () => ({
  QueryKeys: {
    imagesConfig: 'imagesConfig',
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, refetchOnWindowFocus: false },
      mutations: { retry: false },
    },
  });
  const queryProvider = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return queryProvider;
};

describe('useImagesConfig', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(fetchImagesConfig).mockResolvedValue(mockImageConfig);
  });

  it('fetches images configuration', async () => {
    const { result } = renderHook(() => useImagesConfig(), {
      wrapper: createWrapper(),
    });
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.data).toEqual(mockImageConfig);
    expect(fetchImagesConfig).toHaveBeenCalled();
  });

  it('calls fetchImagesConfig when error occurs', async () => {
    const error = new Error('Config fetch failed');
    vi.mocked(fetchImagesConfig).mockRejectedValue(error);
    const { result } = renderHook(() => useImagesConfig(), {
      wrapper: createWrapper(),
    });
    expect(result.current.isLoading).toBe(true);
    expect(fetchImagesConfig).toHaveBeenCalled();
  });

  it('returns loading state initially', () => {
    const { result } = renderHook(() => useImagesConfig(), {
      wrapper: createWrapper(),
    });
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });
});
