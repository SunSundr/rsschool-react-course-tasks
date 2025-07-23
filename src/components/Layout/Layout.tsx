import { createContext, ReactNode, useState } from 'react';
import { Footer } from '../Footer/Footer';
import { Header } from '../Header/Header';
import styles from './Layout.module.css';

type LayoutProps = {
  children: ReactNode;
};

interface RefreshContextType {
  updateTrigger: boolean;
  handleUpdateTrigger: () => void;
}

export const RefreshContext = createContext<RefreshContextType>({
  updateTrigger: false,
  handleUpdateTrigger: () => {},
});

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [updateTrigger, setUpdateTrigger] = useState(false);

  const handleUpdateTrigger = () => {
    setUpdateTrigger((prev) => !prev);
  };

  return (
    <RefreshContext.Provider value={{ updateTrigger, handleUpdateTrigger }}>
      <div className={`${styles.app} dark`}>
        <Header updateContext={handleUpdateTrigger} />
        <main className={styles.content}>{children}</main>
        <Footer />
      </div>
    </RefreshContext.Provider>
  );
};
