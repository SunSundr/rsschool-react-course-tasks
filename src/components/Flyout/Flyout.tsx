'use client';

import { useCallback, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useStore } from '~/store/store';
import styles from './Flyout.module.css';

export const Flyout: React.FC = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const { videos, clearVideos } = useStore();
  const t = useTranslations('flyout');

  const handleDownload = async () => {
    if (isDownloading || videos.length === 0) return;

    setIsDownloading(true);
    try {
      const response = await fetch('/api/download-csv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videos }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${videos.length}_items.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleUnselectAll = useCallback(() => clearVideos(), [clearVideos]);

  const selectedItemsCount = videos.length;

  return (
    <div className={`${styles.flyout} ${selectedItemsCount ? styles.show : ''}`}>
      <div>{t('itemsSelected', { count: selectedItemsCount })}</div>
      <div className={styles.buttons}>
        <button className={styles.button} onClick={handleUnselectAll}>
          {t('unselectAll')}
        </button>
        <button className={styles.button} onClick={handleDownload} disabled={isDownloading}>
          {isDownloading ? t('downloading') : t('download')}
        </button>
      </div>
    </div>
  );
};
