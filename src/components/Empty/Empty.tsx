import { useMemo } from 'react';
import styles from './Empty.module.css';

export const Empty: React.FC = () => {
  const tips = [
    'Try searching for "Avengers"',
    'Try searching for "Batman"',
    'Try searching for "Star Wars"',
    'Try searching for "Marvel"',
    'Try searching for "Disney"',
    'Try searching for "Comedy"',
    'Try searching for "Action"',
    'Try searching for "Horror"',
  ];

  const randomTip = useMemo(() => {
    return tips[Math.floor(Math.random() * tips.length)];
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h3 className={styles.title}>Sorry, nothing was found...</h3>
        <p className={styles.tip}>{randomTip}</p>
      </div>
    </div>
  );
};
