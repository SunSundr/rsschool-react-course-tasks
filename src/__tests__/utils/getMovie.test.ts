import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import * as constants from '../../constants';
import { ResponseError } from '../../utils/error';
import { getDetailMovie, getMovie, getMoviePopTop } from '../../utils/getMovie';

globalThis.fetch = vi.fn();

const urlConfiguration = vi.hoisted(() => ({
  movie: 'https://api.example.com/search/movie',
  popular: 'https://api.example.com/movie/popular',
  topRated: 'https://api.example.com/movie/top_rated',
  movieDetail: 'https://api.example.com/movie',
}));

vi.mock('../../constants', () => ({
  API_PATHS: urlConfiguration,
  TMDB_API_KEY: null,
}));

describe('getMovie', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches movie search results successfully', async () => {
    const mockResult = {
      page: 1,
      results: [{ id: 1, title: 'Test Movie' }],
      total_pages: 1,
      total_results: 1,
    };
    (fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResult),
    });
    const result = await getMovie('Batman');
    expect(fetch).toHaveBeenCalledWith(
      `${urlConfiguration.movie}?query=Batman&language=en-US&page=1`,
      {
        headers: {
          Accept: 'application/json',
        },
      },
    );
    expect(result).toEqual(mockResult);
  });

  it('includes Authorization header when TMDB_API_KEY is present (1)', async () => {
    vi.mocked(constants).TMDB_API_KEY = 'test-api-key';
    (fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ results: [] }),
    });
    await getMovie('Batman');
    expect(fetch).toHaveBeenCalledWith(expect.any(String), {
      headers: {
        Authorization: 'Bearer test-api-key',
        Accept: 'application/json',
      },
    });
  });

  it('handles custom options', async () => {
    (fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ results: [] }),
    });
    await getMovie('Batman', { page: '2', year: '2022', region: 'US' });
    expect(fetch).toHaveBeenCalledWith(
      `${urlConfiguration.movie}?query=Batman&language=en-US&page=2&region=US&year=2022`,
      expect.any(Object),
    );
  });

  it('throws ResponseError when fetch fails', async () => {
    (fetch as Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });
    await expect(getMovie('Batman')).rejects.toThrow(ResponseError);
  });
});

describe('getMoviePopTop', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches top rated movies by default', async () => {
    const mockResult = {
      page: 1,
      results: [{ id: 1, title: 'Top Movie' }],
      total_pages: 1,
      total_results: 1,
    };
    vi.mocked(constants).TMDB_API_KEY = null;
    (fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResult),
    });
    const result = await getMoviePopTop();
    expect(fetch).toHaveBeenCalledWith(
      `https://api.example.com/movie/top_rated?language=en-US&page=1`,
      {
        headers: {
          Accept: 'application/json',
        },
      },
    );
    expect(result).toEqual(mockResult);
  });

  it('includes Authorization header when TMDB_API_KEY is present (2)', async () => {
    vi.mocked(constants).TMDB_API_KEY = 'test-api-key';
    (fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ results: [] }),
    });
    await getMoviePopTop();
    expect(fetch).toHaveBeenCalledWith(expect.any(String), {
      headers: {
        Authorization: 'Bearer test-api-key',
        Accept: 'application/json',
      },
    });
  });

  it('fetches popular movies when type is popular', async () => {
    (fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ results: [] }),
    });
    await getMoviePopTop('popular');
    expect(fetch).toHaveBeenCalledWith(
      `${urlConfiguration.popular}?language=en-US&page=1`,
      expect.any(Object),
    );
  });

  it('handles custom options', async () => {
    (fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ results: [] }),
    });
    await getMoviePopTop('topRated', { page: '3', region: 'GB' });
    expect(fetch).toHaveBeenCalledWith(
      `${urlConfiguration.topRated}?language=en-US&page=3&region=GB`,
      expect.any(Object),
    );
  });

  it('throws ResponseError when fetch fails', async () => {
    (fetch as Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });
    await expect(getMoviePopTop()).rejects.toThrow(ResponseError);
  });
});

describe('getDetailMovie', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches movie detail successfully', async () => {
    const mockResult = {
      id: 123,
      title: 'Test Movie',
      overview: 'Test overview',
    };
    vi.mocked(constants).TMDB_API_KEY = null;
    (fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResult),
    });
    const result = await getDetailMovie('123');
    expect(fetch).toHaveBeenCalledWith(`${urlConfiguration.movieDetail}/123?language=en-US`, {
      headers: {
        Accept: 'application/json',
      },
    });
    expect(result).toEqual(mockResult);
  });

  it('includes Authorization header when TMDB_API_KEY is present', async () => {
    vi.mocked(constants).TMDB_API_KEY = 'test-api-key';
    (fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ id: 123 }),
    });
    await getDetailMovie('123');
    expect(fetch).toHaveBeenCalledWith(expect.any(String), {
      headers: {
        Authorization: 'Bearer test-api-key',
        Accept: 'application/json',
      },
    });
  });

  it('throws ResponseError when fetch fails', async () => {
    (fetch as Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });
    await expect(getDetailMovie('123')).rejects.toThrow(ResponseError);
  });
});
