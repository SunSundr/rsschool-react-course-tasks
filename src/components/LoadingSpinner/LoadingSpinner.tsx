import React from 'react';
import styles from './LoadingSpinner.module.css';

interface LoadingSpinnerProps {
  overlay?: boolean;
  inline?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ overlay, inline }) => {
  return (
    <div
      className={`${styles.container} ${overlay ? styles.overlay : ''} ${inline ? '' : styles.fullPage}`}
    >
      <div className={styles.spinner}>
        <div className={styles.text}>LOADING</div>
      </div>
    </div>
  );
};
