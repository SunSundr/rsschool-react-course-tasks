import { useProgressMessage } from '~/hooks/useProgressMessage';
import { Skeleton } from '../Skeleton/Skeleton';
import styles from '../MainComponent/MainComponent.module.css';

export const Fallback = () => {
  const message = useProgressMessage();
  return (
    <>
      <Skeleton />
      <div className={styles.progressMessage}>{message}</div>
    </>
  );
};
