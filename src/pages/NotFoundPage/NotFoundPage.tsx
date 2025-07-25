import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.css';

export const NotFoundPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.errorCode}>404</div>
        <h1 className={styles.title}>Oops! Page Not Found</h1>
        <div className={styles.message}>
          <p>
            {`This website has many different pages, but the one you're looking for, unfortunately, is
            not among them. 🤷‍♂️`}
          </p>
          <p>
            {`Maybe such a page will be created someday... Don't despair! Perhaps tomorrow it will
            magically appear in our codebase. ✨`}
          </p>
          <p>
            {`Until then, why not explore what we actually have? I promise the existing pages work
            (most of the time). 😊`}
          </p>
        </div>
        <Link to="/" className={styles.homeButton}>
          🏠 Take Me Home
        </Link>
      </div>
    </div>
  );
};
