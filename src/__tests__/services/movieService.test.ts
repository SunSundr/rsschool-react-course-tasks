import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TMDBDetailResult } from '~/types';
import { fetchDetailMovie, fetchImagesConfig, fetchMovies } from '../../services/movieService';
import * as getMovieUtils from '../../utils/getMovie';
import * as imagesConfigUtils from '../../utils/imagesConfig';
import * as queryTypeUtils from '../../utils/queryType';
import { createMockVideo, mockImageConfig } from '../common';

vi.mock('../../utils/getMovie');
vi.mock('../../utils/imagesConfig');
vi.mock('../../utils/queryType');

describe('movieService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchMovies', () => {
    it('calls getMovie when query is provided', async () => {
      const mockResult = { page: 1, results: [], total_pages: 1, total_results: 0 };
      vi.mocked(getMovieUtils.getMovie).mockResolvedValue(mockResult);
      const result = await fetchMovies('Batman', 2);
      expect(getMovieUtils.getMovie).toHaveBeenCalledWith('Batman', { page: '2' });
      expect(result).toEqual(mockResult);
    });

    it('calls getMoviePopTop when query is empty', async () => {
      const mockResult = { page: 1, results: [], total_pages: 1, total_results: 0 };
      const mockQueryType = 'popular';
      vi.mocked(queryTypeUtils.getQueryType).mockReturnValue(mockQueryType);
      vi.mocked(getMovieUtils.getMoviePopTop).mockResolvedValue(mockResult);
      const result = await fetchMovies('', 1);
      expect(queryTypeUtils.getQueryType).toHaveBeenCalled();
      expect(getMovieUtils.getMoviePopTop).toHaveBeenCalledWith(mockQueryType, { page: '1' });
      expect(result).toEqual(mockResult);
    });

    it('calls getMoviePopTop when query is falsy', async () => {
      const mockResult = { page: 1, results: [], total_pages: 1, total_results: 0 };
      const mockQueryType = 'topRated';
      vi.mocked(queryTypeUtils.getQueryType).mockReturnValue(mockQueryType);
      vi.mocked(getMovieUtils.getMoviePopTop).mockResolvedValue(mockResult);
      const result = await fetchMovies('', 3);
      expect(getMovieUtils.getMoviePopTop).toHaveBeenCalledWith(mockQueryType, { page: '3' });
      expect(result).toEqual(mockResult);
    });
  });

  describe('fetchImagesConfig', () => {
    it('calls imagesConfig and returns result', async () => {
      vi.mocked(imagesConfigUtils.imagesConfig).mockResolvedValue(mockImageConfig);
      const result = await fetchImagesConfig();
      expect(imagesConfigUtils.imagesConfig).toHaveBeenCalled();
      expect(result).toEqual(mockImageConfig);
    });
  });

  describe('fetchDetailMovie', () => {
    it('calls getDetailMovie and transforms result', async () => {
      const expectedVideo = createMockVideo();
      const mockDetailResult: TMDBDetailResult = {
        adult: false,
        backdrop_path: expectedVideo.backdrop_path,
        genre_ids: expectedVideo.genre_ids,
        genres: expectedVideo.genre_ids.map((id, index) => ({ id: id, name: `Action ${index}` })),
        id: expectedVideo.id,
        original_language: expectedVideo.original_language,
        original_title: expectedVideo.original_title,
        overview: expectedVideo.overview,
        popularity: expectedVideo.popularity,
        poster_path: expectedVideo.poster_path,
        release_date: expectedVideo.release_date,
        title: expectedVideo.title,
        video: expectedVideo.video,
        vote_average: expectedVideo.vote_average,
        vote_count: expectedVideo.vote_count,
        belongs_to_collection: null,
        budget: 0,
        homepage: '',
        imdb_id: null,
        origin_country: [],
        production_companies: [],
        production_countries: [],
        revenue: 0,
        runtime: null,
        spoken_languages: [],
        status: '',
        tagline: null,
      };
      vi.mocked(getMovieUtils.getDetailMovie).mockResolvedValue(mockDetailResult);
      const result = await fetchDetailMovie('123');
      expect(getMovieUtils.getDetailMovie).toHaveBeenCalledWith('123');
      expect(result).toEqual(expectedVideo);
    });
  });
});
