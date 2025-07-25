import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { TMDBVideo } from '~/types';
import { ResponseError } from '~/utils/error';
import { createMockVideo, mockImageConfig } from './common';
import { RefreshContext } from '../components/Layout/Layout';
import { DetailPage } from '../pages/DetailPage/DetailPage';
import * as movieService from '../services/movieService';

vi.mock('../services/movieService');
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
vi.mock('../utils/error', () => ({
  getErrorData: vi.fn((error: unknown) => {
    const err = error as ResponseError;
    return { message: err.message, statusCode: err.statusCode };
  }),
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

  const renderDetailPage = (locationState?: { video: TMDBVideo }) => {
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

    if (locationState) {
      router.navigate('/detailed/123', { state: locationState, replace: true });
    }

    return render(<RouterProvider router={router} />);
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (movieService.fetchDetailMovie as Mock).mockResolvedValue(mockVideo);
  });

  it('renders loading state initially', async () => {
    (movieService.fetchDetailMovie as Mock).mockImplementation(() => new Promise(() => {}));
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

  it('renders movie details from location state', async () => {
    await act(async () => {
      renderDetailPage({ video: mockVideo });
    });
    expect(screen.getByText('Test Movie')).toBeInTheDocument();
    expect(screen.getByText('Original Test Movie')).toBeInTheDocument();
    expect(screen.getByText('Test overview')).toBeInTheDocument();
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
      renderDetailPage({ video: mockVideo });
    });
    const closeButton = screen.getByRole('button');
    await act(async () => {
      fireEvent.click(closeButton);
    });
    expect(mockContextValue.handleCloseTrigger).toHaveBeenCalled();
  });

  it('renders error state when fetch fails', async () => {
    (movieService.fetchDetailMovie as Mock).mockRejectedValue(new Error('Fetch failed'));
    await act(async () => {
      renderDetailPage();
    });
    await waitFor(() => {
      expect(screen.getByText(/Fetch failed/)).toBeInTheDocument();
    });
  });

  it('renders error with status code', async () => {
    (movieService.fetchDetailMovie as Mock).mockRejectedValue({
      message: 'Not found',
      statusCode: 404,
    });
    await act(async () => {
      renderDetailPage();
    });
    await waitFor(() => {
      expect(screen.getByText('Error 404')).toBeInTheDocument();
      expect(screen.getByText('Not found')).toBeInTheDocument();
    });
  });

  it('renders "Movie not found" when no video data', async () => {
    (movieService.fetchDetailMovie as Mock).mockResolvedValue(null);
    await act(async () => {
      renderDetailPage();
    });
    await waitFor(() => {
      expect(screen.getByText('Movie not found')).toBeInTheDocument();
    });
  });

  it('fetches movie data when id is provided and no video in state', async () => {
    await act(async () => {
      renderDetailPage();
    });
    await waitFor(() => {
      expect(movieService.fetchDetailMovie).toHaveBeenCalledWith('123');
    });
  });

  it('does not fetch when video is provided in location state', async () => {
    await act(async () => {
      renderDetailPage({ video: mockVideo });
    });
    expect(movieService.fetchDetailMovie).not.toHaveBeenCalled();
  });
});
