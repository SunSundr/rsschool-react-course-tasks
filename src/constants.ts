export const DEV_MODE = import.meta.env.DEV;

const baseUrl = DEV_MODE
  ? 'https://api.themoviedb.org'
  : 'https://zxkpc14sca.execute-api.eu-north-1.amazonaws.com';

const apiVersion = DEV_MODE ? '3' : 'prod';

export const API_PATHS = {
  movie: `${baseUrl}/${apiVersion}/search/movie`,
  topRated: `${baseUrl}/${apiVersion}/movie/top_rated`,
  popular: `${baseUrl}/${apiVersion}/movie/popular`,
  configuration: `${baseUrl}/${apiVersion}/configuration`,
};

export const TMDB_API_KEY: string | null = DEV_MODE
  ? import.meta.env.VITE_TMDB_API_ACCESS_KEY
  : null;

export const LS_SEARCHTERM_KEY = 'searchTerm';
