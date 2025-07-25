import { act } from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterAll, beforeAll, beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { localStorageMock, mockImageConfig } from './common';
import { RefreshContext } from '../components/Layout/Layout';
import { MainPage } from '../pages/MainPage/MainPage';
import * as movieService from '../services/movieService';
import { TMDBSearchResult, TMDBVideo } from '../types';

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

vi.mock('../components/SearchBar/SearchBar', () => ({
  SearchBar: ({
    onSearch,
    onClear,
    initialValue,
    loading,
  }: {
    onSearch: (query: string) => void;
    onClear: () => void;
    initialValue: string;
    loading: boolean;
  }) => (
    <div data-testid="search-bar">
      <input
        data-testid="search-input"
        value={initialValue}
        onChange={(e) => onSearch(e.target.value)}
        disabled={loading}
      />
      <button data-testid="search-button" onClick={() => onSearch(initialValue)} disabled={loading}>
        Search
      </button>
      <button data-testid="clear-button" onClick={onClear} disabled={loading}>
        Clear
      </button>
    </div>
  ),
}));

vi.mock('../components/CardList/CardList', () => ({
  CardList: ({
    results,
    handlePageChange,
  }: {
    results: TMDBVideo[];
    handlePageChange: (page: number) => void;
  }) => (
    <div data-testid="card-list">
      {results.map((item, index) => (
        <div key={index} data-testid={`movie-item-${index}`}>
          {item.title}
        </div>
      ))}
      <button data-testid="pagination-next" onClick={() => handlePageChange(2)}>
        Next Page
      </button>
    </div>
  ),
}));

vi.mock('../components/Empty/Empty', () => ({
  Empty: () => <div data-testid="empty-state">No results found</div>,
}));

vi.mock('../components/ErrorInfo/ErrorInfo', () => ({
  ErrorInfo: ({ message }: { message: string }) => (
    <div data-testid="error-info">Error: {message}</div>
  ),
}));

vi.mock('../components/LoadingSpinner/LoadingSpinner', () => ({
  LoadingSpinner: ({ overlay }: { overlay?: boolean }) => (
    <div data-testid={overlay ? 'loading-overlay' : 'loading-spinner'}>Loading...</div>
  ),
}));

vi.mock('../services/movieService');
vi.mock('../utils/callWithDelay', () => ({
  callWithDelay: vi.fn((callback) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = callback();
        resolve(result);
      }, 0);
    });
  }),
}));

vi.mock('../hooks/useLocalStorage', () => ({
  useLocalStorage: vi.fn((_key: string, defaultValue: string) => {
    const setValue = vi.fn();
    return [defaultValue, setValue];
  }),
}));

vi.mock('../utils/error', () => ({
  getErrorData: vi.fn((error: unknown) => ({ message: (error as Error).message })),
  errorLog: vi.fn(),
  formatErrorData: vi.fn((data: unknown) => (data as Error).message),
}));

vi.mock('~/constants', () => ({
  LS_SEARCHTERM_KEY: 'searchTerm',
}));

describe('MainPage Component', () => {
  const mockSearchResult: TMDBSearchResult = {
    page: 1,
    results: [{ id: 1, title: 'Movie 1' } as TMDBVideo, { id: 2, title: 'Movie 2' } as TMDBVideo],
    total_pages: 3,
    total_results: 6,
  };
  const originalConsoleError = globalThis.console.error;
  beforeAll(() => {
    globalThis.console.error = vi.fn();
  });

  afterAll(() => {
    globalThis.console.error = originalConsoleError;
  });

  beforeEach(() => {
    vi.clearAllMocks();
    (movieService.fetchImagesConfig as Mock).mockResolvedValue(mockImageConfig);
    (movieService.fetchMovies as Mock).mockResolvedValue(mockSearchResult);
    localStorage.clear();
  });

  const renderMainPage = (
    contextValue = {
      updateTrigger: false,
      handleUpdateTrigger: vi.fn(),
      closeTrigger: false,
      handleCloseTrigger: vi.fn(),
    },
  ) => {
    const router = createMemoryRouter([
      {
        path: '/',
        element: (
          <RefreshContext.Provider value={contextValue}>
            <MainPage />
          </RefreshContext.Provider>
        ),
      },
    ]);
    return render(<RouterProvider router={router} />);
  };

  it('initializes and loads data correctly', async () => {
    await act(async () => renderMainPage());
    await waitFor(() => {
      expect(movieService.fetchImagesConfig).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(movieService.fetchMovies).toHaveBeenCalledWith('', 1);
      expect(screen.getByTestId('card-list')).toBeInTheDocument();
      expect(screen.getByText('Movie 1')).toBeInTheDocument();
    });
    const searchButton = screen.getByTestId('search-button');
    await act(async () => {
      fireEvent.click(searchButton);
    });
    await waitFor(() => {
      expect(movieService.fetchMovies).toHaveBeenCalledWith('', 1);
    });
  });

  it('handles search correctly', async () => {
    await act(async () => renderMainPage());
    const searchInput = screen.getByTestId('search-input');
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'test query' } });
    });
    await waitFor(() => {
      expect(movieService.fetchMovies).toHaveBeenCalledWith('test query', 1);
    });
  });

  it('handles pagination correctly', async () => {
    await act(async () => renderMainPage());
    await waitFor(() => {
      expect(movieService.fetchMovies).toHaveBeenCalledWith('', 1);
    });
    expect(screen.getByTestId('card-list')).toBeInTheDocument();
  });

  it('responds to context updates', async () => {
    const contextValue1 = {
      updateTrigger: false,
      handleUpdateTrigger: vi.fn(),
      closeTrigger: false,
      handleCloseTrigger: vi.fn(),
    };
    const { rerender } = await act(async () => {
      return renderMainPage(contextValue1);
    });

    const contextValue2 = {
      updateTrigger: true,
      handleUpdateTrigger: vi.fn(),
      closeTrigger: false,
      handleCloseTrigger: vi.fn(),
    };

    await act(async () => {
      const router = createMemoryRouter([
        {
          path: '/',
          element: (
            <RefreshContext.Provider value={contextValue2}>
              <MainPage />
            </RefreshContext.Provider>
          ),
        },
      ]);
      rerender(<RouterProvider router={router} />);
    });

    await waitFor(() => {
      expect(movieService.fetchMovies).toHaveBeenCalled();
    });
  });

  it('shows loading states correctly', async () => {
    (movieService.fetchImagesConfig as Mock).mockImplementation(() => new Promise(() => {}));
    await act(async () => renderMainPage());
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('shows empty state correctly', async () => {
    (movieService.fetchMovies as Mock).mockResolvedValue({
      ...mockSearchResult,
      results: [],
    });
    await act(async () => renderMainPage());
    await waitFor(() => {
      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    });
  });

  it('shows error state correctly (get image config)', async () => {
    (movieService.fetchImagesConfig as Mock).mockRejectedValueOnce(new Error('API Error'));
    (movieService.fetchMovies as Mock).mockClear();
    await act(async () => renderMainPage());
    expect(movieService.fetchImagesConfig).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(screen.getByTestId('error-info')).toHaveTextContent('API Error');
    });
    expect(movieService.fetchMovies).not.toHaveBeenCalled();
  });

  it('shows error state correctly (fetch movies)', async () => {
    (movieService.fetchMovies as Mock).mockRejectedValueOnce(new Error('Fetch error'));
    await act(async () => renderMainPage());
    await waitFor(() => {
      expect(screen.getByTestId('error-info')).toHaveTextContent('Fetch error');
    });
  });

  it('shows empty state when imagesConfig exists but no result', async () => {
    (movieService.fetchMovies as Mock).mockClear();
    (movieService.fetchImagesConfig as Mock).mockClear();
    (movieService.fetchMovies as Mock).mockResolvedValue({
      page: 1,
      results: [],
      total_pages: 0,
      total_results: 0,
    });
    await act(async () => renderMainPage());
    await waitFor(() => {
      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    });
  });

  it('handles clear button click correctly', async () => {
    await act(async () => renderMainPage());
    await waitFor(() => {
      expect(movieService.fetchMovies).toHaveBeenCalledWith('', 1);
    });
    (movieService.fetchMovies as Mock).mockClear();
    const clearButton = screen.getByTestId('clear-button');
    await act(async () => {
      fireEvent.click(clearButton);
    });
    await waitFor(() => {
      expect(movieService.fetchMovies).toHaveBeenCalledWith('', 1);
    });
  });

  it('handles page change correctly', async () => {
    await act(async () => renderMainPage());
    await waitFor(() => {
      expect(movieService.fetchMovies).toHaveBeenCalledWith('', 1);
      expect(screen.getByTestId('card-list')).toBeInTheDocument();
    });
    (movieService.fetchMovies as Mock).mockClear();
    const nextButton = screen.getByTestId('pagination-next');
    await act(async () => {
      fireEvent.click(nextButton);
    });
    await waitFor(() => {
      expect(movieService.fetchMovies).toHaveBeenCalledWith('', 2);
    });
  });

  it('handles refresh context updateTrigger change', async () => {
    const contextValue = {
      updateTrigger: false,
      handleUpdateTrigger: vi.fn(),
      closeTrigger: false,
      handleCloseTrigger: vi.fn(),
    };
    const { rerender } = await act(async () => {
      return renderMainPage(contextValue);
    });
    await waitFor(() => {
      expect(movieService.fetchMovies).toHaveBeenCalledWith('', 1);
    });
    (movieService.fetchMovies as Mock).mockClear();
    const updatedContextValue = {
      ...contextValue,
      updateTrigger: true,
    };
    await act(async () => {
      const router = createMemoryRouter([
        {
          path: '/',
          element: (
            <RefreshContext.Provider value={updatedContextValue}>
              <MainPage />
            </RefreshContext.Provider>
          ),
        },
      ]);
      rerender(<RouterProvider router={router} />);
    });
    await waitFor(() => {
      expect(movieService.fetchMovies).toHaveBeenCalledWith('', 1);
    });
  });
});
