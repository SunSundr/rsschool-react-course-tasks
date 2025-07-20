import { beforeEach, describe, expect, it, vi } from 'vitest';
import { QUERY_KEY } from '~/constants';
import { QueryType } from '~/types';
import { getQueryType, toggleQueryType } from '../../utils/queryType';

const origin = 'http://localhost:3000';
const queryTypes: QueryType[] = ['popular', 'topRated'];
const mockLocation = {
  search: '',
  href: origin,
};

const mockHistory = {
  replaceState: vi.fn(),
};

Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
});

Object.defineProperty(window, 'history', {
  value: mockHistory,
  writable: true,
});

describe('queryType utils', () => {
  beforeEach(() => {
    mockLocation.search = '';
    mockLocation.href = origin;
    mockHistory.replaceState.mockClear();
  });

  describe('getQueryType', () => {
    it('returns null when no query parameter exists', () => {
      mockLocation.search = '';
      expect(getQueryType()).toBeNull();
    });

    for (const queryType of queryTypes) {
      it(`returns ${queryType} when ?${QUERY_KEY}=${queryType}`, () => {
        mockLocation.search = `?${QUERY_KEY}=${queryType}`;
        expect(getQueryType()).toBe(queryType);
      });
    }

    it('returns query value with other parameters present', () => {
      const queryType = queryTypes[0];
      mockLocation.search = `?other=value&${QUERY_KEY}=${queryType}&another=param`;
      expect(getQueryType()).toBe(queryType);
    });
  });

  describe('toggleQueryType', () => {
    it('sets popular query parameter when not present', () => {
      toggleQueryType();
      expect(mockHistory.replaceState).toHaveBeenCalledWith(
        null,
        '',
        `${origin}/?${QUERY_KEY}=${queryTypes[0]}`,
      );
    });

    it('removes popular query parameter when already present', () => {
      const query = `${QUERY_KEY}=${queryTypes[0]}`;
      mockLocation.search = `?${query}`;
      mockLocation.href = `${origin}/?${query}`;
      toggleQueryType();
      expect(mockHistory.replaceState).toHaveBeenCalledWith(null, '', `${origin}/`);
    });

    it('sets popular when different query type is present', () => {
      const query = `${QUERY_KEY}=${queryTypes[1]}`;
      mockLocation.search = `?${query}`;
      mockLocation.href = `${origin}/?${query}`;
      toggleQueryType();
      expect(mockHistory.replaceState).toHaveBeenCalledWith(
        null,
        '',
        `${origin}/?${QUERY_KEY}=${queryTypes[0]}`,
      );
    });

    it('preserves other query parameters', () => {
      const query = `${QUERY_KEY}=${queryTypes[0]}`;
      mockLocation.search = `?other=value&${query}&another=param`;
      mockLocation.href = `${origin}?other=value&${query}&another=param`;
      toggleQueryType();
      expect(mockHistory.replaceState).toHaveBeenCalledWith(
        null,
        '',
        `${origin}/?other=value&another=param`,
      );
    });
  });
});
