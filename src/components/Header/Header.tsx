import { Component } from 'react';
import { APP_NAME, TASK } from '~/constants';
import { toggleQueryType } from '~/utils/queryType';
import styles from './Header.module.css';

interface HeaderProps {
  updateContext: () => void;
}

export class Header extends Component<HeaderProps> {
  setQuery = () => {
    toggleQueryType();
    this.props.updateContext();
  };

  render() {
    return (
      <header className={styles.header}>
        <div className={styles.logo}>
          <img className={styles.image} src="/tmdb.png" alt="No image available" />
          <button onClick={this.setQuery} type="button" className={styles.textButton}>
            {APP_NAME}
          </button>
        </div>
        <a className={styles.links} href={TASK.url}>
          {TASK.title}
        </a>
      </header>
    );
  }
}
