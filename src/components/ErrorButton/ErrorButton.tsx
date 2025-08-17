'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import styles from './ErrorButton.module.css';

export const ErrorButton: React.FC = () => {
  const [error, setError] = useState(false);
  const t = useTranslations('error');

  if (error) {
    const dateObject = new Date(Date.now());
    throw new Error(`Custom error generated at ${dateObject.toLocaleString()}`);
  }
  return (
    <button onClick={() => setError(true)} type="button" className={styles.errorButton}>
      {t('button')}
    </button>
  );
};
