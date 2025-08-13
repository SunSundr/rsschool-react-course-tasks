import { useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from '~/query/settings';
import { TMDBSearchResult } from '~/types';

export const useResetQueries = () => {
  const queryClient = useQueryClient();

  const resetMovieQueries = async (id: number | undefined) => {
    if (!id) return;
    const allMoviesData = queryClient.getQueriesData<TMDBSearchResult[]>({
      queryKey: [QueryKeys.movies],
    });
    queryClient.removeQueries({
      queryKey: [QueryKeys.movies],
      exact: false,
    });
    await queryClient.resetQueries({ queryKey: [QueryKeys.movie, id.toString()] });
    allMoviesData.forEach(([queryKey, data]) => {
      if (data) queryClient.setQueryData(queryKey, data);
    });
  };

  const resetMoviesQueries = async () => {
    queryClient.resetQueries();
  };

  return {
    resetMovieQueries,
    resetMoviesQueries,
  };
};
