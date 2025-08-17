import { Suspense } from 'react';
import { Flyout } from '~/components/Flyout/Flyout';
import MovieGrid from '~/components/MovieGrid/MovieGrid';
import MovieGridCached from '~/components/MovieGrid/MovieGridCached';
import SearchBar from '~/components/SearchBar/SearchBar';
import { PAGE_KEY, QUERY_KEY, SEARCH_KEY } from '~/constants';
import { QueryType } from '~/types';

export interface DefaultPageProps {
  params: Promise<{ locale: string; id?: string }>;
  searchParams: Promise<{ search_query?: string; page?: string; q?: QueryType }>;
}

export default async function DefaultPage({ params, searchParams }: DefaultPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const query = resolvedSearchParams[SEARCH_KEY] || '';
  const page = parseInt(resolvedSearchParams[PAGE_KEY] || '1', 10);
  const defaultQuery: QueryType = resolvedSearchParams[QUERY_KEY] || 'topRated';

  return (
    <div className="content">
      <SearchBar initialQuery={query} />

      <div className="paper">
        <Suspense
          fallback={
            <MovieGridCached
              query={query}
              page={page}
              defaultQuery={defaultQuery}
              id={resolvedParams.id}
            />
          }
        >
          <MovieGrid
            query={query}
            page={page}
            defaultQuery={defaultQuery}
            id={resolvedParams.id}
            locale={resolvedParams.locale}
          />
        </Suspense>
      </div>

      <Flyout />
    </div>
  );
}
