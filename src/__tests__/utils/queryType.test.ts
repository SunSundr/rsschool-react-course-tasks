import { beforeEach, describe, expect, it, vi } from 'vitest';
import { QUERY_KEY } from '~/constants';
import { QueryType } from '~/types';
import { getQueryType } from '../../utils/queryType';

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
});
