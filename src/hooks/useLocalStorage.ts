import { useEffect, useState } from 'react';
export const useLocalStorage = <T>(
  key: string,
  initialValue: T,
  deleteIfEmpty = true,
): [T, (value: T | ((prevValue: T) => T)) => void] => {
  const [value, setValue] = useState<T>(() => {
    try {
      const storedValue = localStorage.getItem(key);
      return storedValue !== null ? JSON.parse(storedValue) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage', error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      const shouldDelete = deleteIfEmpty && (value === null || value === undefined || value === '');

      if (shouldDelete) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error('Error writing to localStorage', error);
    }
  }, [key, value, deleteIfEmpty]);

  return [value, setValue];
};
