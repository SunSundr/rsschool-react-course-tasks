import React from 'react';
import styles from './LoadingSpinner.module.css';

interface LoadingSpinnerProps {
  overlay?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ overlay }) => {
  return (
    <div className={`${styles.container} ${overlay ? styles.overlay : ''}`}>
      <div className={styles.spinner}>
        <div className={styles.text}>LOADING</div>
      </div>
    </div>
  );
};
