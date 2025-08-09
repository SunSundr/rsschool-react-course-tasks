import { useEffect } from 'react';

export const useWindowEvent = <K extends keyof WindowEventMap>(
  event: K,
  handler: (event: WindowEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions,
) => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener(event, handler, options);
      return () => window.removeEventListener(event, handler);
    }
  }, [event, handler, options]);
};
