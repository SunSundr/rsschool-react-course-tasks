import { describe, expect, it } from 'vitest';
import { TMDBVideo } from '../../types';
import { formatReleaseDate } from '../../utils/formatReleaseDate';

const createMockVideo = (overrides: Partial<TMDBVideo> = {}): TMDBVideo => ({
  adult: false,
  backdrop_path: null,
  genre_ids: [],
  id: 1,
  original_language: 'en',
  original_title: 'Test Movie',
  overview: 'Test overview',
  popularity: 7.5,
  poster_path: null,
  release_date: '',
  title: 'Test Movie',
  video: false,
  vote_average: 8.0,
  vote_count: 100,
  ...overrides,
});

describe('formatReleaseDate', () => {
  it('formats valid release date correctly', () => {
    const video = createMockVideo({ release_date: '2023-12-25' });
    expect(formatReleaseDate(video)).toBe('25/12/2023');
  });

  it('formats another valid release date correctly', () => {
    const video = createMockVideo({ release_date: '2022-01-01' });
    expect(formatReleaseDate(video)).toBe('1/1/2022');
  });

  it('extracts year from title when no release_date', () => {
    const video = createMockVideo({
      release_date: '',
      title: 'Batman 2022',
    });
    expect(formatReleaseDate(video)).toBe('2022');
  });

  it('extracts year from original_title when no release_date and title has no year', () => {
    const video = createMockVideo({
      release_date: '',
      title: 'Batman',
      original_title: 'The Batman 2022',
    });
    expect(formatReleaseDate(video)).toBe('2022');
  });

  it('returns ? when no release_date and no year in titles', () => {
    const video = createMockVideo({
      release_date: '',
      title: 'Batman',
      original_title: 'The Batman',
    });
    expect(formatReleaseDate(video)).toBe('?');
  });

  it('returns ? when release_date is invalid', () => {
    const video = createMockVideo({ release_date: 'invalid-date' });
    expect(formatReleaseDate(video)).toBe('?');
  });

  it('handles empty release_date', () => {
    const video = createMockVideo({
      release_date: '',
      title: 'Movie Title',
      original_title: 'Original Title',
    });
    expect(formatReleaseDate(video)).toBe('?');
  });

  it('prefers release_date over title year', () => {
    const video = createMockVideo({
      release_date: '2023-06-15',
      title: 'Movie 2022',
    });
    expect(formatReleaseDate(video)).toBe('15/6/2023');
  });
});
