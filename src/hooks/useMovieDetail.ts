import { useQuery } from '@tanstack/react-query';
import { fetchDetailMovie } from '~/services/movieService';

export const useMovieDetail = (id: string) => {
  return useQuery({
    queryKey: ['movie', id],
    queryFn: () => fetchDetailMovie(id),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
};
