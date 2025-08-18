import { QueryType } from '~/types';
import { getMovie, getMoviePopTop } from '~/utils/getMovie';
import { getImagesConfig } from '~/utils/imagesConfigNext';
import { CardList } from '../CardList/CardList';

interface MovieGridProps {
  query: string;
  page: number;
  defaultQuery: QueryType;
  id?: string;
  loading?: boolean;
  locale?: string;
}

export default async function MovieGrid({ query, page, defaultQuery, id, locale }: MovieGridProps) {
  const imagesConfig = await getImagesConfig();

  const language = { en: 'en-US', ru: 'ru-RU', ua: 'uk-UA' }[locale || 'en'] || 'en';

  const data = query
    ? await getMovie(query, { page: page.toString(), language })
    : await getMoviePopTop(defaultQuery, { page: page.toString(), language });

  return (
    <CardList
      results={data.results}
      imagesConfig={imagesConfig}
      currentPage={data.page}
      totalPages={data.total_pages}
      totalResults={data.total_results}
      cache={{ query, page, defaultQuery }}
      loading={false}
      id={id}
    />
  );
}
