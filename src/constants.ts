export const USE_PROXY =
  process.env.NODE_ENV === 'production' || !process.env.VITE_TMDB_API_ACCESS_KEY;

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
  : process.env.VITE_TMDB_API_ACCESS_KEY || null;

export const LS_SEARCHTERM_KEY = 'searchTerm';
export const LS_THEME_KEY = 'theme';

export const QUERY_KEY = 'q';
export const PAGE_KEY = 'page';
export const SEARCH_KEY = 'search_query';

export enum CSV_Separators {
  comma = ',',
  semicolon = ';',
}

export const CSV_SEPARATOR = CSV_Separators.comma;

export const TASK = {
  title: '#Task 6',
  git: 'https://github.com/SunSundr/rsschool-react-course-tasks',
  avatar: 'https://avatars.githubusercontent.com/u/160144047',
  task: 'https://github.com/rolling-scopes-school/tasks/blob/master/react/modules/tasks/nextjs-ssr-ssg.md',
  course: 'https://rs.school/courses/reactjs',
};

export const APP_NAME = 'TMDB Movie\u25CFSearcher';

export const ITEMS_PER_PAGE = 20;
export const MAX_PAGES = 500;
