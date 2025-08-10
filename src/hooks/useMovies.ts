import { useQuery } from '@tanstack/react-query';
import { delayLoading, QueryKeys } from '~/query/settings';
import { fetchMovies } from '~/services/movieService';

export const useMovies = (query: string, page: number) => {
  return useQuery({
    queryKey: [QueryKeys.movies, query, page],
    queryFn: async () => {
      await delayLoading(2);
      return fetchMovies(query, page);
    },
  });
};
