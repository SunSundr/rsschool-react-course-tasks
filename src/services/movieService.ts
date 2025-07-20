import { ImageConfiguration, TMDBSearchResult } from '~/types';
import { getMovie, getMoviePopTop } from '~/utils/getMovie';
import { imagesConfig } from '~/utils/imagesConfig';
import { getQueryType } from '~/utils/queryType';

export const fetchMovies = async (query: string, page: number): Promise<TMDBSearchResult> => {
  return query
    ? await getMovie(query, { page: page.toString() })
    : await getMoviePopTop(getQueryType());
};

export const fetchImagesConfig = async (): Promise<ImageConfiguration> => {
  return await imagesConfig();
};
