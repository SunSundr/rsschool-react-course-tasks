import { useRouteError } from 'react-router-dom';
import { getErrorData } from '~/utils/error';
import styles from './ErrorBoundary.module.css';

export const RouterErrorFallback = () => {
  const error = useRouteError();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Something went wrong</h2>
        <p className={styles.message}>{getErrorData(error).message}</p>
        <button onClick={() => window.location.reload()} className={styles.resetButton}>
          Reload Page
        </button>
      </div>
    </div>
  );
};
