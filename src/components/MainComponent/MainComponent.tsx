import { Suspense } from 'react';
import { DataLoader } from '../DataLoader';
import { Fallback } from '../Fallback/Fallback';
import { Filters } from '../Filters/Filters';
import styles from './MainComponent.module.css';

const MainComponent = () => {
  return (
    <div className={styles.container}>
      <Filters />
      <Suspense fallback={<Fallback />}>
        <DataLoader />
      </Suspense>
    </div>
  );
};

export default MainComponent;
