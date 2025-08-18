import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import ErrorBoundaryNext from '~/components/ErrorBoundary/ErrorBoundaryNext';
import { Footer } from '~/components/Footer/Footer';
import { Header } from '~/components/Header/Header';
import { ThemeProvider } from '~/theme/ThemeProvider';
import '../globals.css';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            <ErrorBoundaryNext>
              <div className="app">
                <Header />
                {children}
                <Footer />
              </div>
            </ErrorBoundaryNext>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
