import { API_PATHS, TMDB_API_KEY } from '~/constants';
import { TMDBSearchResult } from '~/types';
import { ResponseError } from './error';

export async function getMovie(
  query: string,
  options: Record<string, string> = {},
): Promise<TMDBSearchResult> {
  const searchParams = new URLSearchParams({
    query,
    language: options.language || 'en-US',
    page: options.page || '1',
    ...(options.region && { region: options.region }),
    ...(options.year && { year: options.year }),
  });

  const init: RequestInit = {
    headers: {
      ...(TMDB_API_KEY && { Authorization: `Bearer ${TMDB_API_KEY}` }),
      Accept: 'application/json',
    },
  };

  const response = await fetch(`${API_PATHS.movie}?${searchParams.toString()}`, init);

  if (!response.ok) {
    throw new ResponseError(
      `Failed to fetch movie: ${response.statusText}`,
      'MovieError',
      response.status,
    );
  }

  return await response.json();
}

export async function getMoviePopTop(
  type: 'popular' | 'topRated' = 'topRated',
  options: Record<string, string> = {},
): Promise<TMDBSearchResult> {
  const searchParams = new URLSearchParams({
    language: options.language || 'en-US',
    page: options.page || '1',
    ...(options.region && { region: options.region }),
  });

  const init: RequestInit = {
    headers: {
      ...(TMDB_API_KEY && { Authorization: `Bearer ${TMDB_API_KEY}` }),
      Accept: 'application/json',
    },
  };

  const response = await fetch(
    `${type === 'popular' ? API_PATHS.popular : API_PATHS.topRated}?${searchParams.toString()}`,
    init,
  );

  if (!response.ok) {
    throw new ResponseError(
      `Failed to fetch movie: ${response.statusText}`,
      'MovieError',
      response.status,
    );
  }

  return await response.json();
}
