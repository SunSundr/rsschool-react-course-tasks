import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import * as constants from '../../constants';
import { ResponseError } from '../../utils/error';
import { imagesConfig } from '../../utils/imagesConfig';
import { mockImageConfig } from '../common';

globalThis.fetch = vi.fn();

const { urlConfiguration } = vi.hoisted(() => ({
  urlConfiguration: 'https://api.example.com/configuration',
}));

vi.mock('../../constants', () => ({
  API_PATHS: {
    configuration: urlConfiguration,
  },
  TMDB_API_KEY: null,
}));

describe('imagesConfig', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches and returns image configuration successfully', async () => {
    const mockResponse = {
      images: mockImageConfig,
    };
    (fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });
    const result = await imagesConfig();
    expect(fetch).toHaveBeenCalledWith(urlConfiguration, {
      headers: {
        Accept: 'application/json',
      },
    });
    expect(result).toEqual(mockImageConfig);
  });

  it('includes Authorization header when TMDB_API_KEY is present', async () => {
    vi.mocked(constants).TMDB_API_KEY = 'test-api-key';
    const mockResponse = {
      images: mockImageConfig,
    };
    (fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });
    await imagesConfig();
    expect(fetch).toHaveBeenCalledWith(urlConfiguration, {
      headers: {
        Authorization: 'Bearer test-api-key',
        Accept: 'application/json',
      },
    });
  });

  it('throws ResponseError when fetch fails', async () => {
    (fetch as Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });
    await expect(imagesConfig()).rejects.toThrow(ResponseError);
  });

  it('throws ResponseError with correct properties', async () => {
    (fetch as Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });
    try {
      await imagesConfig();
    } catch (error) {
      expect(error).toBeInstanceOf(ResponseError);
      expect((error as ResponseError).name).toBe('ImagesConfigError');
      expect((error as ResponseError).statusCode).toBe(500);
      expect((error as ResponseError).message).toBe(
        'Failed to fetch configuration: Internal Server Error',
      );
    }
  });

  it('handles network errors', async () => {
    (fetch as Mock).mockRejectedValueOnce(new Error('Network error'));
    await expect(imagesConfig()).rejects.toThrow('Network error');
  });
});
