import DefaultPage, { DefaultPageProps } from '~/components/DefaultPage/DefaultPage';

export default async function Detailed({ params, searchParams }: DefaultPageProps) {
  return <DefaultPage params={params} searchParams={searchParams} />;
}
