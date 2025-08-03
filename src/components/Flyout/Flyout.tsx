import React, { useCallback, useEffect, useRef, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
import { TMDBSearchResult } from '~/types';
// import { unselectAll } from '../../app/selectedItemsSlice';
// import { downloadCSV } from '../../utils/downloadCSV';
// import { RootState } from '../../app/store';
import styles from './Flyout.module.css';

export interface FlyoutProps {
  data: TMDBSearchResult | undefined;
}

const Flyout: React.FC<FlyoutProps> = ({ data }) => {
  console.log('download', data);
  // const dispatch = useDispatch();
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const linkRef = useRef<HTMLAnchorElement | null>(null);
  // const selectedItems = useSelector((state: RootState) => state.selectedItems.items);

  const handleDownload = () => {
    //downloadCSV(data, selectedItems, setDownloadUrl);
  };

  const handleUnselectAll = useCallback(() => {
    // dispatch(unselectAll());
    // dispatch
  }, []);

  useEffect(() => {
    if (downloadUrl && linkRef.current) {
      linkRef.current.click();
      URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
    }
  }, [downloadUrl]);

  // const selectedItemsCount = selectedItems.length;
  const selectedItemsCount = 5;

  //if (selectedItemsCount === 0) return null;

  return (
    <div className={styles.flyout}>
      <div>{selectedItemsCount} items are selected</div>
      <div className={styles.buttons}>
        <button onClick={handleUnselectAll}>Unselect all</button>
        <button onClick={handleDownload}>Download</button>
      </div>
      {/* {downloadUrl && (
        <a
          href={downloadUrl || '#'}
          download={`${selectedItemsCount}_.csv`}
          style={{ display: 'none' }}
          ref={linkRef}
          role="link"
        >
          Download
        </a>
      )} */}
    </div>
  );
};

export default Flyout;
