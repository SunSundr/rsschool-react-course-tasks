import { createContext, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useImagesConfig } from '~/hooks/useImagesConfig';
import useTheme from '~/theme/useTheme';
import { ImageConfiguration } from '~/types';
import { Footer } from '../Footer/Footer';
import { Header } from '../Header/Header';
import styles from './Layout.module.css';

interface RefreshContextType {
  updateTrigger: boolean;
  handleUpdateTrigger: () => void;
  closeTrigger: boolean;
  handleCloseTrigger: () => void;
  imagesConfig?: ImageConfiguration;
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
  const { theme } = useTheme();
  const { data: imagesConfig } = useImagesConfig();

  const handleUpdateTrigger = () => setUpdateTrigger((prev) => !prev);
  const handleCloseTrigger = () => setCloseTrigger((prev) => !prev);

  return (
    <RefreshContext.Provider
      value={{ updateTrigger, handleUpdateTrigger, closeTrigger, handleCloseTrigger, imagesConfig }}
    >
      <div className={`${styles.app} ${theme}`}>
        <Header updateContext={handleUpdateTrigger} />
        <main className={styles.content}>
          <Outlet context={{ imagesConfig }} />
        </main>
        <Footer />
      </div>
    </RefreshContext.Provider>
  );
};
