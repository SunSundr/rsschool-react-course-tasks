'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import styles from './NotFoundPage.module.css';

export default function NotFoundPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const t = useTranslations('notFound');

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.errorCode}>404</div>
        <h1 className={styles.title}>{t('title')}</h1>
        <div className={styles.message}>
          <p>{t('message1')}</p>
          <p>{t('message2')}</p>
          <p>{t('message3')}</p>
        </div>
        <Link href={`/${locale}`} className={styles.homeButton}>
          🏠 {t('homeButton')}
        </Link>
      </div>
    </div>
  );
}
