import { createContext, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Footer } from '../Footer/Footer';
import { Header } from '../Header/Header';
import styles from './Layout.module.css';

// type LayoutProps = {
//   children: ReactNode;
// };

interface RefreshContextType {
  updateTrigger: boolean;
  handleUpdateTrigger: () => void;
  closeTrigger: boolean;
  handleCloseTrigger: () => void;
}

export const RefreshContext = createContext<RefreshContextType>({
  updateTrigger: false,
  handleUpdateTrigger: () => {},
  closeTrigger: false,
  handleCloseTrigger: () => {},
});

export const Layout: React.FC = () => {
  const [updateTrigger, setUpdateTrigger] = useState(false);
  const [closeTrigger, setCloseTrigger] = useState(false);

  const handleUpdateTrigger = () => {
    setUpdateTrigger((prev) => !prev);
  };

  const handleCloseTrigger = () => {
    setCloseTrigger((prev) => !prev);
  };

  return (
    <RefreshContext.Provider
      value={{ updateTrigger, handleUpdateTrigger, closeTrigger, handleCloseTrigger }}
    >
      <div className={`${styles.app} dark`}>
        <Header updateContext={handleUpdateTrigger} />
        <main className={styles.content}>
          <Outlet />
        </main>
        <Footer />
      </div>
    </RefreshContext.Provider>
  );
};
