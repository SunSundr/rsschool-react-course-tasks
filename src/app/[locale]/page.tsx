import DefaultPage, { DefaultPageProps } from '~/components/DefaultPage/DefaultPage';

export default async function Main({ params, searchParams }: DefaultPageProps) {
  return <DefaultPage params={params} searchParams={searchParams} />;
}
