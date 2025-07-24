import { QUERY_KEY } from '~/constants';
import { QueryType } from '~/types';

export function getQueryType(): QueryType {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(QUERY_KEY) as QueryType;
}
