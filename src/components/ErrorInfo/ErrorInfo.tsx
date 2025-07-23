import styles from './ErrorInfo.module.css';

interface ErrorInfoProps {
  message: string;
}

export const ErrorInfo: React.FC<ErrorInfoProps> = ({ message }: ErrorInfoProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h3 className={styles.title}>Error</h3>
        <p className={styles.message}>{message}</p>
      </div>
    </div>
  );
};
