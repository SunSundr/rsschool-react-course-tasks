import { API_PATHS, TMDB_API_KEY } from '~/constants';
import { QueryType, TMDBDetailResult, TMDBSearchResult } from '~/types';
import { getErrorResponceObject, ResponseError } from './error';

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
    const errObj = await getErrorResponceObject(response);
    throw new ResponseError(errObj.status_message, 'MovieError', response.status);
  }

  return await response.json();
}

export async function getMoviePopTop(
  type: QueryType = 'topRated',
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
    const errObj = await getErrorResponceObject(response);
    throw new ResponseError(errObj.status_message, 'MovieError', response.status);
  }

  return await response.json();
}

export async function getDetailMovie(
  id: string,
  options: Record<string, string> = {},
): Promise<TMDBDetailResult> {
  const searchParams = new URLSearchParams({
    language: options.language || 'en-US',
  });

  const init: RequestInit = {
    headers: {
      ...(TMDB_API_KEY && { Authorization: `Bearer ${TMDB_API_KEY}` }),
      Accept: 'application/json',
    },
  };

  const response = await fetch(`${API_PATHS.movieDetail}/${id}?${searchParams.toString()}`, init);

  if (!response.ok) {
    const errObj = await getErrorResponceObject(response);
    throw new ResponseError(errObj.status_message, 'MovieDetailError', response.status);
  }

  return await response.json();
}
