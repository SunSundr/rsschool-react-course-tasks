import { useQuery } from '@tanstack/react-query';
import { fetchMovies } from '~/services/movieService';

export const useMovies = (query: string, page: number) => {
  return useQuery({
    queryKey: ['movies', query, page],
    queryFn: () => fetchMovies(query, page),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};
