import { useQueryClient } from '@tanstack/react-query';

export const useRefreshData = () => {
  const queryClient = useQueryClient();

  const refreshMovies = (query: string, page: number) => {
    queryClient.invalidateQueries({ queryKey: ['movies', query, page] });
  };

  const refreshMovieDetail = (id: string) => {
    queryClient.invalidateQueries({ queryKey: ['movie', id] });
  };

  const refreshImagesConfig = () => {
    queryClient.invalidateQueries({ queryKey: ['imagesConfig'] });
  };

  const refreshAll = () => {
    queryClient.invalidateQueries();
  };

  return {
    refreshMovies,
    refreshMovieDetail,
    refreshImagesConfig,
    refreshAll,
  };
};
