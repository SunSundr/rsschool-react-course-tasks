export interface TMDBVideo {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface TMDBSearchResult {
  page: number;
  results: TMDBVideo[];
  total_pages: number;
  total_results: number;
}

export enum BackdropSize {
  W300 = 'w300',
  W780 = 'w780',
  W1280 = 'w1280',
  ORIGINAL = 'original',
}

export enum LogoSize {
  W45 = 'w45',
  W92 = 'w92',
  W154 = 'w154',
  W185 = 'w185',
  W300 = 'w300',
  W500 = 'w500',
  ORIGINAL = 'original',
}

export enum PosterSize {
  W92 = 'w92',
  W154 = 'w154',
  W185 = 'w185',
  W342 = 'w342',
  W500 = 'w500',
  W780 = 'w780',
  ORIGINAL = 'original',
}

export enum ProfileSize {
  W45 = 'w45',
  W185 = 'w185',
  H632 = 'h632',
  ORIGINAL = 'original',
}

export enum StillSize {
  W92 = 'w92',
  W185 = 'w185',
  W300 = 'w300',
  ORIGINAL = 'original',
}

export interface ImageConfiguration {
  base_url: string;
  secure_base_url: string;
  backdrop_sizes: BackdropSize[];
  logo_sizes: LogoSize[];
  poster_sizes: PosterSize[];
  profile_sizes: ProfileSize[];
  still_sizes: StillSize[];
}

export interface TMDBConfiguration {
  change_keys: string[];
  images: ImageConfiguration;
}

export type ImageType = 'backdrop' | 'logo' | 'poster' | 'profile' | 'still';

export type ImageSizes =
  | BackdropSize
  | LogoSize
  | PosterSize
  | ProfileSize
  | StillSize
  | 'original';

export interface ImageUrlParams {
  filePath?: string;
  size?: ImageSizes;
  type?: ImageType;
  useSecure?: boolean;
}

export type QueryType = 'popular' | 'topRated' | null;
