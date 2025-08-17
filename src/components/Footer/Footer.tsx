import Image from 'next/image';
import { TASK } from '~/constants';
import { ErrorButton } from '../ErrorButton/ErrorButton';
import styles from './Footer.module.css';

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.linksWrap}>
        <Image src="/github-mark.svg" alt="GitHub logo" height={32} width={32} />
        <a className={styles.links} href={TASK.git}>
          SunSundr/rsschool-react-course-tasks
        </a>

        <Image src="/rss-logo.svg" alt="RS School logo" height={32} width={32} />
        <a className={styles.links} href="https://rs.school/">
          Rolling Scopes School
        </a>
      </div>
      <ErrorButton />
    </footer>
  );
};
