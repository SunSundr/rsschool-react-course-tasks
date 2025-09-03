import { useProgressMessage } from '~/hooks/useProgressMessage';
import { Button } from '../Button/Button';
import { Filters } from '../Filters/Filters';
import { Skeleton } from '../Skeleton/Skeleton';
import styles from '../DataLoader/DataLoader.module.css';

export const Fallback = () => {
  const message = useProgressMessage();
  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <Filters disabled={true} />
        <Button className={styles.controlButton} size="small" disabled={true}>
          Select Columns
        </Button>
      </div>
      <Skeleton />
      <div className={styles.progressMessage}>{message}</div>
    </div>
  );
};
