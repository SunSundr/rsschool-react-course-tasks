import { API_PATHS } from '~/constants';
import { TMDBSearchResult } from '~/types';

const apiAccessKey = import.meta.env.VITE_TMDB_API_ACCESS_KEY;

export async function getMovie(
  query: string,
  params: Record<string, string> = {},
): Promise<TMDBSearchResult> {
  const searchParams = new URLSearchParams({
    query,
    language: params.language || 'en-US',
    page: params.page || '1',
    // region: params.region || '',
    // year: params.year || '',
  });

  const param: RequestInit = {
    headers: {
      ...(apiAccessKey && { Authorization: `Bearer ${apiAccessKey}` }),
      Accept: 'application/json',
    },
  };

  const response = await fetch(`${API_PATHS.movie}?${searchParams.toString()}`, param);
  return await response.json();
}
