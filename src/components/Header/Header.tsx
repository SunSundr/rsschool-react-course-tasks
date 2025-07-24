import { Link } from 'react-router-dom';
import { APP_NAME } from '~/constants';
import { toggleQueryType } from '~/utils/queryType';
import styles from './Header.module.css';

interface HeaderProps {
  updateContext: () => void;
}

export const Header: React.FC<HeaderProps> = ({ updateContext }) => {
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
      <Link to="/about" className={styles.linkButton}>
        About
      </Link>
    </header>
  );
};
