'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { TASK } from '~/constants';
import styles from './AboutPage.module.css';

interface AboutPageProps {
  locale: string;
}

export default function AboutPage({ locale }: AboutPageProps) {
  const router = useRouter();
  const t = useTranslations('about');

  const handleClose = () => {
    router.push(`/${locale}`);
  };

  return (
    <div className={styles.container}>
      <button className={styles.closeButton} onClick={handleClose}>
        <span className={styles.closeCrossText}>×</span>
      </button>
      <div className={styles.content}>
        <div className={styles.header}>
          <Image
            src={TASK.avatar}
            alt="Aleksandr Kovalenko"
            height={120}
            width={120}
            className={styles.avatar}
          />

          <div className={styles.intro}>
            <h1 className={styles.title}>{t('title')}</h1>
            <h2 className={styles.name}>{t('name')}</h2>
            <h3 className={styles.nickname}>{t('nickname')}</h3>
            <p className={styles.subtitle}>{t('subtitle')}</p>
          </div>
        </div>

        <div className={styles.description}>
          <p>{t('description1')}</p>
          <p>{t('description2')}</p>
          <p>{t('description3')}</p>

          <div className={styles.taskLink}>
            <p>
              {t('taskIntro')}{' '}
              <a
                href={TASK?.course ?? ''}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                {t('courseLink')}
              </a>
              :
            </p>

            <a
              href={TASK?.task ?? ''}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              📚 {t('taskLink')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
