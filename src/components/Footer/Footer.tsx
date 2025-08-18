import Image from 'next/image';
import { TASK } from '~/constants';
import { Link } from '~/i18n/navigation';
import { ErrorButton } from '../ErrorButton/ErrorButton';
import styles from './Footer.module.css';

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.linksWrap}>
        <Image src="/github-mark.svg" alt="GitHub logo" height={32} width={32} />
        <Link href={TASK.git} className={styles.links} prefetch={true}>
          SunSundr/rsschool-react-course-tasks
        </Link>

        <Image src="/rss-logo.svg" alt="RS School logo" height={32} width={32} />
        <Link href="https://rs.school/" className={styles.links} prefetch={true}>
          Rolling Scopes School
        </Link>
      </div>
      <ErrorButton />
    </footer>
  );
};
