import AboutPage from '~/components/About/AboutPage';

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export default async function About({ params }: AboutPageProps) {
  const { locale } = await params;
  return <AboutPage locale={locale} />;
}
