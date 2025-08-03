import { afterEach, describe, expect, it, vi } from 'vitest';
import { TMDBVideo } from '~/types';
import { downloadCSV } from '~/utils/downloadCSV';
import { createMockVideo } from '../common';

vi.mock('./formatReleaseDate', () => ({
  formatReleaseDate: vi.fn().mockReturnValue('2023-01-01'),
}));

global.URL.createObjectURL = vi.fn(() => 'mock-url');

describe('downloadCSV', () => {
  const mockSetDownloadUrl = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should generate correct CSV for empty array', () => {
    downloadCSV([], mockSetDownloadUrl);
    expect(mockSetDownloadUrl).toHaveBeenCalledWith('mock-url');
    const blob = mockSetDownloadUrl.mock.calls[0][0];
    expect(blob).toBe('mock-url');
  });

  it('should generate correct CSV for single video', () => {
    const video = createMockVideo();
    downloadCSV([video], mockSetDownloadUrl);
    expect(mockSetDownloadUrl).toHaveBeenCalledWith('mock-url');
  });

  it('should handle missing fields', () => {
    const video: Partial<TMDBVideo> = {
      id: 456,
      title: undefined,
      overview: '',
      genre_ids: undefined,
    };

    downloadCSV([video as TMDBVideo], mockSetDownloadUrl);
    expect(mockSetDownloadUrl).toHaveBeenCalledWith('mock-url');
  });

  it('should escape special characters', () => {
    const video = createMockVideo({
      id: 789,
      title: 'Movie, with "quotes"',
      overview: 'Line\nBreak',
      genre_ids: [4, 5],
    });
    downloadCSV([video], mockSetDownloadUrl);
    expect(mockSetDownloadUrl).toHaveBeenCalledWith('mock-url');
  });

  it('should generate correct CSV for multiple videos', () => {
    const videos: TMDBVideo[] = [
      createMockVideo({ id: 1, title: 'Movie 1' }),
      createMockVideo({ id: 2, title: 'Movie 2' }),
    ];
    downloadCSV(videos, mockSetDownloadUrl);
    expect(mockSetDownloadUrl).toHaveBeenCalledWith('mock-url');
    expect(global.URL.createObjectURL).toHaveBeenCalledTimes(1);
  });
});
