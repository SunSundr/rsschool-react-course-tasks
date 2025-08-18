'use client';

import { LoadingSpinner } from '~/components/LoadingSpinner/LoadingSpinner';
import { useStore } from '~/store/store';
import { QueryType } from '~/types';
import { CardList } from '../CardList/CardList';

interface MovieGridCachedProps {
  query: string;
  page: number;
  defaultQuery: QueryType;
  id?: string;
}

export default function MovieGridCached({ query, page, defaultQuery, id }: MovieGridCachedProps) {
  const { cachedSearchResult, cache, imagesConfig } = useStore();

  if (!cachedSearchResult || !cache || !imagesConfig) {
    return <LoadingSpinner />;
  }

  return (
    <CardList
      results={cachedSearchResult.results}
      imagesConfig={imagesConfig}
      currentPage={cachedSearchResult.page}
      totalPages={cachedSearchResult.total_pages}
      totalResults={cachedSearchResult.total_results}
      cache={{ query, page, defaultQuery }}
      loading={true}
      id={id}
    />
  );
}
