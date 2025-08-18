'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import styles from './Empty.module.css';

export const Empty: React.FC = () => {
  const t = useTranslations('empty');

  const tips = [
    t('tip1'),
    t('tip2'),
    t('tip3'),
    t('tip4'),
    t('tip5'),
    t('tip6'),
    t('tip7'),
    t('tip8'),
  ];

  const randomTip = useMemo(() => {
    return tips[Math.floor(Math.random() * tips.length)];
  }, [tips]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h3 className={styles.title}>{t('title')}</h3>
        <p className={styles.tip}>{randomTip}</p>
      </div>
    </div>
  );
};
