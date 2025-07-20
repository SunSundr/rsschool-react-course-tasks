import { act } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterAll, beforeAll, beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { mockImageConfig } from './common';
import { RefreshContext } from '../components/Layout/Layout';
import MainPage from '../pages/MainPage/MainPage';
import * as movieService from '../services/movieService';
import { TMDBSearchResult, TMDBVideo } from '../types';

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

vi.mock('../components/SearchBar/SearchBar', () => ({
  default: ({
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
  default: ({ results }: { results: TMDBVideo[] }) => (
    <div data-testid="card-list">
      {results.map((item, index) => (
        <div key={index} data-testid={`movie-item-${index}`}>
          {item.title}
        </div>
      ))}
    </div>
  ),
}));

vi.mock('../components/Empty/Empty', () => ({
  default: () => <div data-testid="empty-state">No results found</div>,
}));

vi.mock('../components/ErrorInfo/ErrorInfo', () => ({
  ErrorInfo: ({ message }: { message: string }) => (
    <div data-testid="error-info">Error: {message}</div>
  ),
}));

vi.mock('../components/LoadingSpinner/LoadingSpinner', () => ({
  default: ({ overlay }: { overlay?: boolean }) => (
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

  const renderMainPage = (contextValue = { updateTrigger: false }) => {
    return render(
      <RefreshContext.Provider value={contextValue}>
        <MainPage />
      </RefreshContext.Provider>,
    );
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
    const searchButton = screen.getByTestId('search-button');
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'test query' } });
      fireEvent.click(searchButton);
    });
    await waitFor(() => {
      expect(movieService.fetchMovies).toHaveBeenCalledWith('test query', 1);
      expect(localStorage.setItem).toHaveBeenCalledWith('searchTerm', 'test query');
    });
  });

  it('handles show more correctly', async () => {
    localStorageMock.setItem('searchTerm', 'test query');
    await act(async () => renderMainPage());
    await waitFor(() => {
      expect(movieService.fetchMovies).toHaveBeenCalledWith('test query', 1);
    });
    const showMoreButton = screen.getByText('Show More');
    await act(async () => {
      fireEvent.click(showMoreButton);
    });
    await waitFor(() => {
      expect(movieService.fetchMovies).toHaveBeenCalledWith('test query', 2);
    });
  });

  it('responds to context updates', async () => {
    let updateTrigger = false;
    const updateContext = () => {
      updateTrigger = !updateTrigger;
    };
    const { rerender } = await act(async () => {
      return render(
        <RefreshContext.Provider value={{ updateTrigger }}>
          <MainPage />
        </RefreshContext.Provider>,
      );
    });
    await act(async () => {
      updateContext();
      rerender(
        <RefreshContext.Provider value={{ updateTrigger }}>
          <MainPage />
        </RefreshContext.Provider>,
      );
    });
    await waitFor(() => {
      expect(movieService.fetchMovies).toHaveBeenCalledWith('', 1);
      expect(localStorage.removeItem).toHaveBeenCalledWith('searchTerm');
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
    (movieService.fetchImagesConfig as Mock).mockRejectedValue(new Error('API Error'));
    await act(async () => renderMainPage());
    await waitFor(() => {
      expect(screen.getByTestId('error-info')).toHaveTextContent('API Error');
    });
  });

  it('shows error state correctly (fetch movies)', async () => {
    (movieService.fetchMovies as Mock).mockRejectedValueOnce(new Error('Fetch error'));
    await act(async () => renderMainPage());
    await waitFor(() => {
      expect(screen.getByTestId('error-info')).toHaveTextContent('Fetch error');
    });
  });
});
