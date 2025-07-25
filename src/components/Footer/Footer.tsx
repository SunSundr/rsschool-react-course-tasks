import { TASK } from '~/constants';
import { ErrorButton } from '../ErrorButton/ErrorButton';
import styles from './Footer.module.css';

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.linksWrap}>
        <img style={{ height: 32 }} src="github-mark.svg" alt="GitHub logo" />
        <a className={styles.links} href={TASK.git}>
          SunSundr/rsschool-react-course-tasks
        </a>
        <img
          style={{ height: 32 }}
          src="https://rs.school/_next/static/media/rss-logo.c19ce1b4.svg"
          alt="RS School logo"
        />
        <a className={styles.links} href="https://rs.school/">
          Rolling Scopes School
        </a>
      </div>
      <ErrorButton />
    </footer>
  );
};
