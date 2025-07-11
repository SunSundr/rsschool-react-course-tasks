import { Component } from 'react';
import { setQueryType } from '~/utils/queryType';
import styles from './Header.module.css';

interface HeaderProps {
  updateSearch: (clearDefault?: boolean) => void;
}

export class Header extends Component<HeaderProps> {
  setQuery = () => {
    setQueryType();
    this.props.updateSearch(true);
  };

  render() {
    return (
      <header className={styles.header}>
        <div className={styles.logo}>
          <img className={styles.image} src="/tmdb.png" alt="No image available" />
          <button onClick={this.setQuery} type="button" className={styles.textButton}>
            TMDB Movie&#9679;Searcher
          </button>
        </div>
        <a
          className={styles.links}
          href="https://github.com/rolling-scopes-school/tasks/blob/master/react/modules/tasks/class-components.md"
        >
          #Task 1
        </a>
      </header>
    );
  }
}
