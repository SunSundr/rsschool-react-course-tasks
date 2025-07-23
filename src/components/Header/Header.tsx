import { APP_NAME, TASK } from '~/constants';
import { toggleQueryType } from '~/utils/queryType';
import styles from './Header.module.css';

interface HeaderProps {
  updateContext: () => void;
}

export const Header: React.FC<HeaderProps> = ({ updateContext }: HeaderProps) => {
  const setQuery = () => {
    toggleQueryType();
    updateContext();
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img className={styles.image} src="/tmdb.png" alt="No image available" />
        <button onClick={setQuery} type="button" className={styles.textButton}>
          {APP_NAME}
        </button>
      </div>
      <a className={styles.links} href={TASK.url}>
        {TASK.title}
      </a>
    </header>
  );
};
