import { Suspense } from 'react';
import { DataLoader } from '../DataLoader';
import { Fallback } from '../Fallback/Fallback';

export const MainComponent = () => {
  return (
    <Suspense fallback={<Fallback />}>
      <DataLoader />
    </Suspense>
  );
};
