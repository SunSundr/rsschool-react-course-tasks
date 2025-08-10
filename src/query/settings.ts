export const defaultQueries = {
  staleTime: 5 * 60 * 1000,
  gcTime: 10 * 60 * 1000,
  retry: 2,
  refetchOnWindowFocus: false,
};

export enum QueryKeys {
  movies = 'movies',
  movie = 'movie',
  imagesConfig = 'imagesConfig',
}

const FAKE_LOADING_DELAY = 300;

export const delayLoading = (n = 1) =>
  new Promise((resolve) => setTimeout(resolve, FAKE_LOADING_DELAY / n));
