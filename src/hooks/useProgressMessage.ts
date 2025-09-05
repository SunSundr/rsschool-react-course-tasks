import { useEffect, useState } from 'react';
import { progressStore } from '~/store/progressStore';

export const useProgressMessage = () => {
  const [message, setMessage] = useState(progressStore.getState().message);

  useEffect(() => {
    const unsubscribe = progressStore.subscribe((state) => {
      setMessage(state.message);
    });

    return unsubscribe;
  }, []);

  return message;
};
