import { lazy } from 'react';

export const MainComponent = lazy(() => {
  return import.meta.env.VITE_DISABLE_OPTIMIZATIONS
    ? import('./MainComponent')
    : import('./MainComponentOpt');
});
