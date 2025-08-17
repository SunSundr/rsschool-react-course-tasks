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
      <div className={styles.clock}>
        <div className={styles.clockFace}>
          <div className={styles.hourHand}></div>
          <div className={styles.minuteHand}></div>
          <div className={styles.center}></div>
        </div>
      </div>
    </div>
  );
};
