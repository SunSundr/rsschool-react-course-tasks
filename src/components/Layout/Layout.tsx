import { Component, createContext, ReactNode } from 'react';
import { Footer } from '../Footer/Footer';
import { Header } from '../Header/Header';
import styles from './Layout.module.css';

type LayoutProps = {
  children: ReactNode;
};

interface LayoutState {
  updateTrigger: boolean;
}

export const RefreshContext = createContext<LayoutState>({
  updateTrigger: false,
});

export class Layout extends Component<LayoutProps, LayoutState> {
  state: LayoutState = { updateTrigger: false };

  handleUpdateTrigger = () => {
    this.setState({ updateTrigger: !this.state.updateTrigger });
  };

  render() {
    return (
      <RefreshContext.Provider value={{ updateTrigger: this.state.updateTrigger }}>
        <div className={`${styles.app} dark`}>
          <Header updateContext={this.handleUpdateTrigger} />
          <main className={styles.content}>{this.props.children}</main>
          <Footer />
        </div>
      </RefreshContext.Provider>
    );
  }
}

export default Layout;
