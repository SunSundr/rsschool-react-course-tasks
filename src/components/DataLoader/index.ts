import { lazy } from 'react';

export const DataLoader = lazy(() => {
  return import.meta.env.VITE_DISABLE_OPTIMIZATIONS
    ? import('./DataLoader')
    : import('./DataLoaderOpt');
});
