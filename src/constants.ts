export const USE_PROXY = !import.meta.env.DEV || !import.meta.env.VITE_TMDB_API_ACCESS_KEY;

const baseUrl = USE_PROXY
  ? 'https://zxkpc14sca.execute-api.eu-north-1.amazonaws.com'
  : 'https://api.themoviedb.org';

const apiVersion = USE_PROXY ? 'prod' : '3';

export const API_PATHS = {
  movie: `${baseUrl}/${apiVersion}/search/movie`,
  topRated: `${baseUrl}/${apiVersion}/movie/top_rated`,
  popular: `${baseUrl}/${apiVersion}/movie/popular`,
  configuration: `${baseUrl}/${apiVersion}/configuration`,
};

export const TMDB_API_KEY: string | null = USE_PROXY
  ? null
  : import.meta.env.VITE_TMDB_API_ACCESS_KEY;

export const LS_SEARCHTERM_KEY = 'searchTerm';

export const QUERY_KEY = 'q';

export const TASK = {
  title: '#Task 1',
  url: 'https://github.com/rolling-scopes-school/tasks/blob/master/react/modules/tasks/class-components.md',
  git: 'https://github.com/SunSundr/rsschool-react-course-tasks',
};

export const APP_NAME = 'TMDB Movie\u25CFSearcher';
