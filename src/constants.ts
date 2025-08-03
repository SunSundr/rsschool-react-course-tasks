export const USE_PROXY = !import.meta.env.DEV || !import.meta.env.VITE_TMDB_API_ACCESS_KEY;

const baseUrl = USE_PROXY
  ? 'https://zxkpc14sca.execute-api.eu-north-1.amazonaws.com'
  : 'https://api.themoviedb.org';

const apiVersion = USE_PROXY ? 'prod' : '3';

export const API_PATHS = {
  movie: `${baseUrl}/${apiVersion}/search/movie`,
  movieDetail: `${baseUrl}/${apiVersion}/movie`,
  topRated: `${baseUrl}/${apiVersion}/movie/top_rated`,
  popular: `${baseUrl}/${apiVersion}/movie/popular`,
  configuration: `${baseUrl}/${apiVersion}/configuration`,
};

export const TMDB_API_KEY: string | null = USE_PROXY
  ? null
  : import.meta.env.VITE_TMDB_API_ACCESS_KEY;

export const LS_SEARCHTERM_KEY = 'searchTerm';
export const LS_THEME_KEY = 'theme';

export const QUERY_KEY = 'q';

export const TASK = {
  title: '#Task 4',
  git: 'https://github.com/SunSundr/rsschool-react-course-tasks',
  avatar: 'https://avatars.githubusercontent.com/u/160144047',
};

export const APP_NAME = 'TMDB Movie\u25CFSearcher';

export const ITEMS_PER_PAGE = 20;
export const MAX_PAGES = 500;
