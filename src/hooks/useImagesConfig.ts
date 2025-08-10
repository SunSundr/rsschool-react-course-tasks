import { useQuery } from '@tanstack/react-query';
import { QueryKeys } from '~/query/settings';
import { fetchImagesConfig } from '~/services/movieService';

export const useImagesConfig = () => {
  return useQuery({
    queryKey: [QueryKeys.imagesConfig],
    queryFn: fetchImagesConfig,
    staleTime: 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    retry: 3,
    refetchOnWindowFocus: false,
  });
};
