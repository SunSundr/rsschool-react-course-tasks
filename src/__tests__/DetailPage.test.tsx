import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { UseQueryResult } from '@tanstack/react-query';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useMovieDetail } from '~/hooks/useMovieDetail';
import { Theme, TMDBVideo } from '~/types';
import { createMockVideo, mockImageConfig } from './common';
import { RefreshContext } from '../components/Layout/Layout';
import { DetailPage } from '../pages/DetailPage/DetailPage';

vi.mock('~/store/store', () => ({
  useStore: () => ({
    theme: Theme.Dark,
  }),
}));

const mockResetMovieQueries = vi.fn();
vi.mock('~/hooks/useRefreshData', () => ({
  useResetQueries: () => ({
    resetMovieQueries: mockResetMovieQueries,
  }),
}));

vi.mock('~/hooks/useMovieDetail', () => ({
  useMovieDetail: vi.fn(),
}));
vi.mock('../helpers/renderImage', () => ({
  renderImage: () => <img data-testid="movie-image" alt="Movie poster" />,
}));
vi.mock('../components/LoadingSpinner/LoadingSpinner', () => ({
  LoadingSpinner: () => <div data-testid="loading-spinner">Loading...</div>,
}));
vi.mock('../utils/formatReleaseDate', () => ({
  formatReleaseDate: () => '2023-12-25',
}));
vi.mock('../utils/safeCall', () => ({
  safeCall: (value: unknown, method: string) => {
    if (method === 'toLocaleUpperCase') return 'EN';
    if (method === 'toFixed') return '8.5';
    return value;
  },
}));
vi.mock('../utils/imageBaseUrl', () => ({
  imageBaseUrl: vi.fn(() => 'https://test-image-url.com'),
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const mod = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...mod,
    useOutletContext: vi.fn(() => ({ imagesConfig: mockImageConfig })),
  };
});

describe('DetailPage', () => {
  const mockVideo = createMockVideo();

  const mockContextValue = {
    updateTrigger: false,
    handleUpdateTrigger: vi.fn(),
    closeTrigger: false,
    handleCloseTrigger: vi.fn(),
  };

  const renderDetailPage = () => {
    const router = createMemoryRouter(
      [
        {
          path: '/detailed/:id',
          element: (
            <RefreshContext.Provider value={mockContextValue}>
              <DetailPage />
            </RefreshContext.Provider>
          ),
        },
      ],
      {
        initialEntries: ['/detailed/123'],
      },
    );

    return render(<RouterProvider router={router} />);
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useMovieDetail).mockReturnValue({
      data: mockVideo,
      isLoading: false,
      error: null,
    } as UseQueryResult<TMDBVideo, Error>);
  });

  it('renders loading state initially', async () => {
    vi.mocked(useMovieDetail).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as UseQueryResult<TMDBVideo, Error>);
    await act(async () => {
      renderDetailPage();
    });
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders movie details when data is loaded', async () => {
    await act(async () => {
      renderDetailPage();
    });
    await waitFor(() => {
      expect(screen.getByText('Test Movie')).toBeInTheDocument();
      expect(screen.getByText('Original Test Movie')).toBeInTheDocument();
      expect(screen.getByText('Test overview')).toBeInTheDocument();
    });
  });

  it('renders metadata chips', async () => {
    await act(async () => {
      renderDetailPage();
    });
    await waitFor(() => {
      expect(screen.getByText('EN')).toBeInTheDocument();
      expect(screen.getByText('2023-12-25')).toBeInTheDocument();
      expect(screen.getByText('8.5')).toBeInTheDocument();
      expect(screen.getByText('8.5/8.5')).toBeInTheDocument();
    });
  });

  it('renders movie image', async () => {
    await act(async () => {
      renderDetailPage();
    });
    await waitFor(() => {
      expect(screen.getByTestId('movie-image')).toBeInTheDocument();
    });
  });

  it('renders close button and calls handleCloseTrigger when clicked', async () => {
    await act(async () => {
      renderDetailPage();
    });
    const closeButton = screen.getAllByRole('button')[0];
    await act(async () => {
      fireEvent.click(closeButton);
    });
    expect(mockContextValue.handleCloseTrigger).toHaveBeenCalled();
  });

  it('renders error state when fetch fails', async () => {
    vi.mocked(useMovieDetail).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Fetch failed'),
    } as UseQueryResult<TMDBVideo, Error>);
    await act(async () => {
      renderDetailPage();
    });
    await waitFor(() => {
      expect(screen.getByText(/Fetch failed/)).toBeInTheDocument();
    });
  });

  it('renders error message', async () => {
    vi.mocked(useMovieDetail).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: { message: 'Not found' },
    } as UseQueryResult<TMDBVideo, Error>);
    await act(async () => {
      renderDetailPage();
    });
    await waitFor(() => {
      expect(screen.getByText('Not found')).toBeInTheDocument();
    });
  });

  it('renders "Movie not found" when no video data', async () => {
    vi.mocked(useMovieDetail).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    } as unknown as UseQueryResult<TMDBVideo, Error>);
    await act(async () => {
      renderDetailPage();
    });
    await waitFor(() => {
      expect(screen.getByText('Movie not found')).toBeInTheDocument();
    });
  });

  it('calls useMovieDetail hook with correct id', async () => {
    await act(async () => {
      renderDetailPage();
    });
    expect(useMovieDetail).toHaveBeenCalledWith('123');
  });

  it('renders refresh button and calls resetMovieQueries when clicked', async () => {
    await act(async () => {
      renderDetailPage();
    });
    const refreshButton = screen.getAllByRole('button')[1];
    await act(async () => {
      fireEvent.click(refreshButton);
    });
    expect(mockResetMovieQueries).toHaveBeenCalledWith(mockVideo.id);
  });
});
