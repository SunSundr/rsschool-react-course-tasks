import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchImagesConfig, fetchMovies } from '../../services/movieService';
import * as getMovieUtils from '../../utils/getMovie';
import * as imagesConfigUtils from '../../utils/imagesConfig';
import * as queryTypeUtils from '../../utils/queryType';
import { mockImageConfig } from '../common';

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
      expect(getMovieUtils.getMoviePopTop).toHaveBeenCalledWith(mockQueryType);
      expect(result).toEqual(mockResult);
    });

    it('calls getMoviePopTop when query is falsy', async () => {
      const mockResult = { page: 1, results: [], total_pages: 1, total_results: 0 };
      const mockQueryType = 'topRated';
      vi.mocked(queryTypeUtils.getQueryType).mockReturnValue(mockQueryType);
      vi.mocked(getMovieUtils.getMoviePopTop).mockResolvedValue(mockResult);
      const result = await fetchMovies('', 3);
      expect(getMovieUtils.getMoviePopTop).toHaveBeenCalledWith(mockQueryType);
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
});
