import {
  BackdropSize,
  ImageConfiguration,
  LogoSize,
  PosterSize,
  ProfileSize,
  StillSize,
  TMDBVideo,
} from '~/types';

export const mockImageConfig: ImageConfiguration = {
  base_url: 'http://image.tmdb.org/t/p/',
  secure_base_url: 'https://image.tmdb.org/t/p/',
  backdrop_sizes: Object.values(BackdropSize),
  poster_sizes: Object.values(PosterSize),
  logo_sizes: Object.values(LogoSize),
  profile_sizes: Object.values(ProfileSize),
  still_sizes: Object.values(StillSize),
};

export const createMockVideo = (overrides: Partial<TMDBVideo> = {}): TMDBVideo => ({
  adult: false,
  backdrop_path: '/backdrop.jpg',
  genre_ids: [28, 12],
  id: 123,
  original_language: 'en',
  original_title: 'Original Test Movie',
  overview: 'Test overview',
  popularity: 8.5,
  poster_path: '/poster.jpg',
  release_date: '2023-12-25',
  title: 'Test Movie',
  video: false,
  vote_average: 8.5,
  vote_count: 1000,
  ...overrides,
});
