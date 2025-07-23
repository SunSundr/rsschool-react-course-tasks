import { useState } from 'react';
import styles from './ErrorButton.module.css';

export const ErrorButton = () => {
  const [error, setError] = useState(false);

  if (error) {
    const dateObject = new Date(Date.now());
    throw new Error(`Custom error generated at ${dateObject.toLocaleString()}`);
  }
  return (
    <button onClick={() => setError(true)} type="button" className={styles.errorButton}>
      Error Button
    </button>
  );
};
