import { API_PATHS, TMDB_API_KEY } from '~/constants';
import { ImageConfiguration, TMDBConfiguration } from '~/types';
import { ResponseError } from './error';

export async function imagesConfig(): Promise<ImageConfiguration> {
  const param: RequestInit = {
    headers: {
      ...(TMDB_API_KEY && { Authorization: `Bearer ${TMDB_API_KEY}` }),
      Accept: 'application/json',
    },
  };
  const response = await fetch(API_PATHS.configuration, param);

  if (!response.ok) {
    throw new ResponseError(
      `Failed to fetch configuration: ${response.statusText}`,
      'ImagesConfigError',
      response.status,
    );
  }

  const configuration: TMDBConfiguration = await response.json();

  return configuration.images;
}
