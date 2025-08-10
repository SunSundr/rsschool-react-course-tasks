import { act } from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { UseQueryResult } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { useImagesConfig } from '~/hooks/useImagesConfig';
import { useMovies } from '~/hooks/useMovies';
import { localStorageMock, mockImageConfig } from './common';
import { RefreshContext } from '../components/Layout/Layout';
import { MainPage } from '../pages/MainPage/MainPage';
import { ImageConfiguration, TMDBSearchResult, TMDBVideo } from '../types';

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

vi.mock('~/store/store', () => ({
  useStore: vi.fn(),
}));

vi.mock('../components/Flyout/Flyout', () => ({
  Flyout: () => <div data-testid="flyout">Flyout</div>,
}));

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

vi.mock('~/hooks/useImagesConfig', () => ({
  useImagesConfig: vi.fn(),
}));

vi.mock('~/hooks/useMovies', () => ({
  useMovies: vi.fn(),
}));

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

vi.mock('../hooks/useLocalStorage', () => {
  let mockValue = '';
  return {
    useLocalStorage: vi.fn((_key: string, defaultValue: string) => {
      const setValue = vi.fn((newValue: string) => {
        mockValue = newValue;
      });
      return [mockValue || defaultValue, setValue];
    }),
  };
});

vi.mock('../utils/error', () => ({
  getErrorData: vi.fn((error: unknown) => ({ message: (error as Error).message })),
  errorLog: vi.fn(),
  formatErrorData: vi.fn((data: unknown) => (data as Error).message),
}));

vi.mock('~/constants', () => ({
  LS_SEARCHTERM_KEY: 'searchTerm',
  LS_THEME_KEY: 'theme',
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
    vi.mocked(useImagesConfig).mockReturnValue({
      data: mockImageConfig,
      isLoading: false,
      isError: false,
      isPending: false,
      error: null,
    } as UseQueryResult<ImageConfiguration, Error>);
    vi.mocked(useMovies).mockReturnValue({
      data: mockSearchResult,
      isLoading: false,
      isError: false,
      isPending: false,
      error: null,
    } as UseQueryResult<TMDBSearchResult, Error>);
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
      expect(screen.getByTestId('card-list')).toBeInTheDocument();
      expect(screen.getByText('Movie 1')).toBeInTheDocument();
    });
    expect(useImagesConfig).toHaveBeenCalled();
    expect(useMovies).toHaveBeenCalledWith('', 1);
  });

  it('handles search correctly', async () => {
    await act(async () => renderMainPage());
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.getByTestId('search-button')).toBeInTheDocument();
    expect(useMovies).toHaveBeenCalled();
  });

  it('handles pagination correctly', async () => {
    await act(async () => renderMainPage());
    await waitFor(() => {
      expect(screen.getByTestId('card-list')).toBeInTheDocument();
    });
    expect(useMovies).toHaveBeenCalled();
    const nextButton = screen.getByTestId('pagination-next');
    await act(async () => {
      fireEvent.click(nextButton);
    });
    expect(nextButton).toBeInTheDocument();
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

    expect(useMovies).toHaveBeenCalled();
  });

  it('shows loading states correctly', async () => {
    vi.mocked(useImagesConfig).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      isPending: true,
      error: null,
    } as UseQueryResult<ImageConfiguration, Error>);
    await act(async () => renderMainPage());
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('shows empty state correctly', async () => {
    vi.mocked(useMovies).mockReturnValue({
      data: { ...mockSearchResult, results: [] },
      isLoading: false,
      isError: false,
      isPending: false,
      error: null,
    } as unknown as UseQueryResult<TMDBSearchResult, Error>);
    await act(async () => renderMainPage());
    await waitFor(() => {
      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    });
  });

  it('shows error state correctly (get image config)', async () => {
    vi.mocked(useImagesConfig).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      isPending: false,
      error: new Error('API Error'),
    } as UseQueryResult<ImageConfiguration, Error>);
    await act(async () => renderMainPage());
    await waitFor(() => {
      expect(screen.getByTestId('error-info')).toHaveTextContent('API Error');
    });
  });

  it('shows error state correctly (fetch movies)', async () => {
    vi.mocked(useMovies).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      isPending: false,
      error: new Error('Fetch error'),
    } as UseQueryResult<TMDBSearchResult, Error>);
    await act(async () => renderMainPage());
    await waitFor(() => {
      expect(screen.getByTestId('error-info')).toHaveTextContent('Fetch error');
    });
  });

  it('shows empty state when imagesConfig exists but no result', async () => {
    vi.mocked(useMovies).mockReturnValue({
      data: {
        page: 1,
        results: [],
        total_pages: 0,
        total_results: 0,
      },
      isLoading: false,
      isError: false,
      isPending: false,
      error: null,
    } as unknown as UseQueryResult<TMDBSearchResult, Error>);
    await act(async () => renderMainPage());
    await waitFor(() => {
      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    });
  });

  it('handles clear button click correctly', async () => {
    await act(async () => renderMainPage());
    expect(useMovies).toHaveBeenCalledWith('', 1);
    const clearButton = screen.getByTestId('clear-button');
    await act(async () => {
      fireEvent.click(clearButton);
    });
    expect(useMovies).toHaveBeenCalledWith('', 1);
  });

  it('handles page change correctly', async () => {
    await act(async () => renderMainPage());
    await waitFor(() => {
      expect(screen.getByTestId('card-list')).toBeInTheDocument();
    });
    expect(useMovies).toHaveBeenCalledWith('', 1);
    const nextButton = screen.getByTestId('pagination-next');
    await act(async () => {
      fireEvent.click(nextButton);
    });
    expect(useMovies).toHaveBeenCalledWith('', 2);
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
    expect(useMovies).toHaveBeenCalledWith('', 1);
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
    expect(useMovies).toHaveBeenCalledWith('', 1);
  });
});
