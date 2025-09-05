import { Outlet } from 'react-router-dom';
import { APP_TITLE } from '~/constants';
import styles from './Layout.module.css';

export const Layout = () => {
  return (
    <div>
      <h1 className={styles.title}>{APP_TITLE}</h1>
      <main>
        <Outlet />
      </main>
    </div>
  );
};
