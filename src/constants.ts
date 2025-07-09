const baseUrl = 'https://api.themoviedb.org';

export const API_PATHS = {
  movie: `${baseUrl}/3/search/movie`,
  discover: `${baseUrl}/3/discover/movie`,
  multi: `${baseUrl}/3/search/multi`,
  tv: `${baseUrl}/3/search/tv`,
  configuration: `${baseUrl}/3/configuration`,
};

export const LS_SEARCHTERM_KEY = 'searchTerm';
