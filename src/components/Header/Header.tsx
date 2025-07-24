import { Link, useSearchParams } from 'react-router-dom';
import { APP_NAME, QUERY_KEY } from '~/constants';
import { QueryType } from '~/types';
import styles from './Header.module.css';

interface HeaderProps {
  updateContext: () => void;
}

export const Header: React.FC<HeaderProps> = ({ updateContext }) => {
  const [, setSearchParams] = useSearchParams();

  const toggleQueryType = () => {
    const type: QueryType = 'popular';
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      if (params.get(QUERY_KEY) === type) {
        params.delete(QUERY_KEY);
      } else {
        params.set(QUERY_KEY, type);
      }
      return params;
    });
  };

  const setQuery = () => {
    toggleQueryType();
    setTimeout(() => updateContext(), 350);
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img className={styles.image} src="/tmdb.png" alt="No image available" />
        <button onClick={setQuery} type="button" className={styles.textButton}>
          {APP_NAME}
        </button>
      </div>
      <Link to="/about" className={styles.linkButton}>
        About
      </Link>
    </header>
  );
};
