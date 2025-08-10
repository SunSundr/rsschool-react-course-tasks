import { useQuery, useQueryClient } from '@tanstack/react-query';
import { delayLoading, QueryKeys } from '~/query/settings';
import { fetchDetailMovie } from '~/services/movieService';
import { TMDBSearchResult } from '~/types';

export const useMovieDetail = (id: string) => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: [QueryKeys.movie, id],
    queryFn: async () => {
      const allMovies = queryClient
        .getQueriesData<TMDBSearchResult[]>({
          queryKey: [QueryKeys.movies],
        })
        .flatMap(([_, data]) => data || []);
      for (const movie of allMovies) {
        const foundMovie = movie.results.find((m) => m.id === Number(id));
        if (foundMovie) {
          await delayLoading();
          return foundMovie;
        }
      }
      await delayLoading();
      return fetchDetailMovie(id);
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: !!id,
  });
};
