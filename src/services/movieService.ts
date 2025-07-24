import { ImageConfiguration, TMDBDetailResult, TMDBSearchResult, TMDBVideo } from '~/types';
import { getDetailMovie, getMovie, getMoviePopTop } from '~/utils/getMovie';
import { imagesConfig } from '~/utils/imagesConfig';
import { getQueryType } from '~/utils/queryType';

export const fetchMovies = async (query: string, page: number): Promise<TMDBSearchResult> => {
  return query
    ? await getMovie(query, { page: page.toString() })
    : await getMoviePopTop(getQueryType(), { page: page.toString() });
};

export const fetchImagesConfig = async (): Promise<ImageConfiguration> => {
  return await imagesConfig();
};

export const fetchDetailMovie = async (id: string): Promise<TMDBVideo> => {
  const video = await getDetailMovie(id);
  return transformDetailToVideo(video);
};

export function transformDetailToVideo(detail: TMDBDetailResult): TMDBVideo {
  return {
    adult: detail.adult,
    backdrop_path: detail.backdrop_path,
    genre_ids: detail.genres.map((genre) => genre.id),
    id: detail.id,
    original_language: detail.original_language,
    original_title: detail.original_title,
    overview: detail.overview,
    popularity: detail.popularity,
    poster_path: detail.poster_path,
    release_date: detail.release_date,
    title: detail.title,
    video: detail.video,
    vote_average: detail.vote_average,
    vote_count: detail.vote_count,
  };
}
