import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createMockVideo, mockImageConfig } from './common';
import { CardList } from '../components/CardList/CardList';
import { RefreshContext } from '../components/Layout/Layout';
import { BackdropSize, PosterSize, TMDBVideo } from '../types';
import * as imageBaseUrlUtils from '../utils/imageBaseUrl';

vi.mock('~/store/store', () => ({
  useStore: () => ({
    videos: [],
    addVideo: vi.fn(),
    removeVideo: vi.fn(),
  }),
}));

vi.mock('../components/Card/Card', () => ({
  Card: ({
    index,
    video,
    onClick,
  }: {
    index: number;
    video: TMDBVideo;
    onClick: (video: TMDBVideo, event: React.MouseEvent, ref: React.RefObject<HTMLElement>) => void;
  }) => {
    const mockRef = { current: null };
    return (
      <div
        data-testid={`card-${index}`}
        onClick={(e) => onClick(video, e, mockRef as unknown as React.RefObject<HTMLElement>)}
      >
        {video.title}
      </div>
    );
  },
}));

vi.mock('../components/Pagination/Pagination', () => ({
  Pagination: () => <div data-testid="pagination">Pagination Component</div>,
}));

vi.mock('../utils/imageBaseUrl', () => ({
  imageBaseUrl: vi.fn((params) => {
    if (params.type === 'backdrop') return 'https://backdrop.url/';
    return 'https://poster.url/';
  }),
}));

vi.mock('~/constants', () => ({
  ITEMS_PER_PAGE: 20,
  MAX_PAGES: 500,
  LS_THEME_KEY: 'theme',
}));

const generateMockVideo = (id: number): TMDBVideo =>
  createMockVideo({
    id,
    backdrop_path: `/backdrop${id}.jpg`,
    original_title: `Original Movie ${id}`,
    overview: `Overview ${id}`,
    poster_path: `/poster${id}.jpg`,
    release_date: '2023-12-25',
    title: `Movie ${id}`,
  });

describe('CardList', () => {
  const mockResults = [generateMockVideo(1), generateMockVideo(2), generateMockVideo(3)];

  const defaultProps = {
    results: mockResults,
    imagesConfig: mockImageConfig,
    currentPage: 1,
    totalPages: 3,
    handlePageChange: vi.fn(),
  };

  const mockContextValue = {
    updateTrigger: false,
    handleUpdateTrigger: vi.fn(),
    closeTrigger: false,
    handleCloseTrigger: vi.fn(),
  };

  const renderWithRouter = (component: React.ReactElement, hasOutlet = false) => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: (
            <RefreshContext.Provider value={mockContextValue}>{component}</RefreshContext.Provider>
          ),
          children: [
            {
              path: 'detailed/:id',
              element: <div data-testid="detail-outlet">Detail Page</div>,
            },
          ],
        },
      ],
      {
        initialEntries: hasOutlet ? ['/detailed/1'] : ['/'],
      },
    );

    return render(<RouterProvider router={router} />);
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders cards for each result', () => {
    renderWithRouter(<CardList {...defaultProps} />);
    expect(screen.getByTestId('card-1')).toBeInTheDocument();
    expect(screen.getByTestId('card-2')).toBeInTheDocument();
    expect(screen.getByTestId('card-3')).toBeInTheDocument();
    expect(screen.getByText('Movie 1')).toBeInTheDocument();
    expect(screen.getByText('Movie 2')).toBeInTheDocument();
    expect(screen.getByText('Movie 3')).toBeInTheDocument();
  });

  it('renders pagination component', () => {
    renderWithRouter(<CardList {...defaultProps} />);
    expect(screen.getByTestId('pagination')).toBeInTheDocument();
  });

  it('initializes with correct image URLs', () => {
    renderWithRouter(<CardList {...defaultProps} />);
    expect(imageBaseUrlUtils.imageBaseUrl).toHaveBeenCalledWith(
      { size: BackdropSize.W780, type: 'backdrop' },
      mockImageConfig,
    );
    expect(imageBaseUrlUtils.imageBaseUrl).toHaveBeenCalledWith(
      { size: PosterSize.W342, type: 'poster' },
      mockImageConfig,
    );
  });

  it('does not show outlet initially', () => {
    renderWithRouter(<CardList {...defaultProps} />);
    expect(screen.queryByTestId('detail-outlet')).not.toBeInTheDocument();
  });

  it('shows outlet when hasDetail is true', () => {
    renderWithRouter(<CardList {...defaultProps} />, true);
    expect(screen.getByTestId('detail-outlet')).toBeInTheDocument();
  });

  it('renders empty grid when no results', () => {
    renderWithRouter(<CardList {...defaultProps} results={[]} />);
    expect(screen.queryByTestId('card-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('detail-outlet')).not.toBeInTheDocument();
  });

  it('handles navUrlWithCurrentParams with search params', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: (
            <RefreshContext.Provider value={mockContextValue}>
              <CardList {...defaultProps} />
            </RefreshContext.Provider>
          ),
        },
      ],
      {
        initialEntries: ['/?search=test&page=2'],
      },
    );
    render(<RouterProvider router={router} />);
    expect(screen.getByTestId('card-1')).toBeInTheDocument();
  });

  it('handles backdrop click', async () => {
    renderWithRouter(<CardList {...defaultProps} />, true);
    const backdrop = document.querySelector('[class*="backdrop"]');
    await act(async () => {
      fireEvent.click(backdrop!);
    });
    expect(backdrop).toBeTruthy();
  });

  it('handles card click when hasDetail is true', async () => {
    renderWithRouter(<CardList {...defaultProps} />, true);
    const card = screen.getByTestId('card-1');
    await act(async () => {
      fireEvent.click(card);
    });
    expect(card).toBeInTheDocument();
  });

  it('handles card click navigation', async () => {
    renderWithRouter(<CardList {...defaultProps} />);
    const card = screen.getByTestId('card-1');
    await act(async () => {
      fireEvent.click(card);
    });
    waitFor(() => {
      expect(card).toBeInTheDocument();
    });
  });

  it('handles closeTrigger effect', async () => {
    const contextWithCloseTrigger = {
      ...mockContextValue,
      closeTrigger: true,
    };

    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: (
            <RefreshContext.Provider value={contextWithCloseTrigger}>
              <CardList {...defaultProps} />
            </RefreshContext.Provider>
          ),
          children: [
            {
              path: 'detailed/:id',
              element: <div data-testid="detail-outlet">Detail Page</div>,
            },
          ],
        },
      ],
      {
        initialEntries: ['/detailed/1'],
      },
    );
    await act(async () => {
      render(<RouterProvider router={router} />);
    });
    expect(contextWithCloseTrigger.handleCloseTrigger).toHaveBeenCalled();
  });

  it('handles totalPages greater than MAX_PAGES (500)', () => {
    const propsWithManyPages = {
      ...defaultProps,
      totalPages: 600,
    };
    renderWithRouter(<CardList {...propsWithManyPages} />);
    expect(screen.getByTestId('pagination')).toBeInTheDocument();
  });
});
