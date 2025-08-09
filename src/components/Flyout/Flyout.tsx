import { useCallback, useEffect, useRef, useState } from 'react';
import { useStore } from '~/store/store';
import { downloadCSV } from '~/utils/downloadCSV';
import styles from './Flyout.module.css';

export const Flyout: React.FC = () => {
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const linkRef = useRef<HTMLAnchorElement | null>(null);
  const { videos, clearVideos } = useStore();

  const handleDownload = () => downloadCSV(videos, setDownloadUrl);
  const handleUnselectAll = useCallback(() => clearVideos(), []);

  useEffect(() => {
    if (downloadUrl && linkRef.current) {
      linkRef.current.click();
      URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
    }
  }, [downloadUrl]);

  const selectedItemsCount = videos.length;

  return (
    <div className={`${styles.flyout} ${selectedItemsCount ? styles.show : ''}`}>
      <div>{selectedItemsCount} items are selected</div>
      <div className={styles.buttons}>
        <button onClick={handleUnselectAll}>Unselect all</button>
        <button onClick={handleDownload}>Download</button>
      </div>
      {downloadUrl && (
        <a
          href={downloadUrl || '#'}
          download={`${selectedItemsCount}_items.csv`}
          style={{ display: 'none' }}
          ref={linkRef}
          role="link"
        >
          Download
        </a>
      )}
    </div>
  );
};
