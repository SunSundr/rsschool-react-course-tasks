import { Outlet } from 'react-router-dom';
import { TITLE } from '~/constants';
import styles from './Layout.module.css';

export const Layout = () => {
  return (
    <div>
      <h1 className={styles.title}>{TITLE}</h1>
      <main>
        <Outlet />
      </main>
    </div>
  );
};
