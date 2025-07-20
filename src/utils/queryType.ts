import { QUERY_KEY } from '~/constants';
import { QueryType } from '~/types';

export function getQueryType(): QueryType {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(QUERY_KEY) as QueryType;
}

export function toggleQueryType(): void {
  const type: QueryType = 'popular';
  const urlParams = new URLSearchParams(window.location.search);
  const url = new URL(window.location.href);
  const params = url.searchParams;
  if (urlParams.get(QUERY_KEY) === type) {
    params.delete(QUERY_KEY);
  } else {
    params.set(QUERY_KEY, type);
  }
  history.replaceState(null, '', url.href);
}
