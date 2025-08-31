import { Suspense } from 'react';
import { TITLE } from '~/constants';
import { DataLoader } from '../DataLoader/DataLoader';
import { Filters } from '../Filters/Filters';
import { Skeleton } from '../Skeleton/Skeleton';
import styles from './MainComponent.module.css';

export const MainComponent = () => {
  return (
    <Suspense
      fallback={
        <div className={styles.container}>
          <h1 className={styles.title}>{TITLE}</h1>
          <Filters disabled={true} />
          <Skeleton />
        </div>
      }
    >
      <DataLoader />
    </Suspense>
  );
};
