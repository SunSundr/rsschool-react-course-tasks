import { Component } from 'react';
import { QUERY_KEY } from '~/constants';
import { QueryType } from '~/types';
import styles from './Header.module.css';

interface HeaderProps {
  updateSearch: (clearDefault?: boolean) => void;
}

export class Header extends Component<HeaderProps> {
  setQuery = () => {
    const type: QueryType = 'popular';
    const urlParams = new URLSearchParams(window.location.search);
    const url = new URL(window.location.href);
    const params = url.searchParams;
    if (urlParams.get(QUERY_KEY) === type) {
      params.delete(QUERY_KEY);
    } else {
      params.set(QUERY_KEY, type);
    }
    history.replaceState(null, '', url.href);
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
