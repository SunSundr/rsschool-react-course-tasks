import { StateCreator } from 'zustand';
import { ImageConfiguration, QueryType, TMDBSearchResult } from '~/types';

export interface SearchCacheSlice {
  cachedSearchResult: TMDBSearchResult | null;
  cache: {
    query: string;
    page: number;
    defaultQuery: QueryType;
  } | null;
  imagesConfig: ImageConfiguration | null;
  setCachedResult: (
    result: TMDBSearchResult,
    params: { query: string; page: number; defaultQuery: QueryType },
    imagesConfig: ImageConfiguration,
  ) => void;
  clearCachedResult: () => void;
}

export const createSearchCacheSlice: StateCreator<SearchCacheSlice> = (set) => ({
  cachedSearchResult: null,
  cache: null,
  imagesConfig: null,
  setCachedResult: (result, params, imagesConfig) =>
    set({ cachedSearchResult: result, cache: params, imagesConfig }),
  clearCachedResult: () => set({ cachedSearchResult: null, cache: null, imagesConfig: null }),
});
