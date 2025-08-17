import { QueryType } from '~/types';
import { getMovie, getMoviePopTop } from '~/utils/getMovie';
import { getImagesConfig } from '~/utils/imagesConfigNext';
import { CardList } from '../CardList/CardList';

interface MovieGridNextProps {
  query: string;
  page: number;
  defaultQuery: QueryType;
  id?: string;
  loading?: boolean;
}

export default async function MovieGridNext({ query, page, defaultQuery, id }: MovieGridNextProps) {
  const imagesConfig = await getImagesConfig();

  const data = query
    ? await getMovie(query, { page: page.toString() })
    : await getMoviePopTop(defaultQuery, { page: page.toString() });

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
