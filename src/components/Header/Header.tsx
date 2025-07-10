import { Component } from 'react';
import styles from './Header.module.css';

export class Header extends Component {
  render() {
    return (
      <header className={styles.header}>
        <div className={styles.logo}>
          <img className={styles.image} src="/tmdb.png" alt="No image available" />
          <div className={styles.text}>TMDB Movie&#9679;Searcher</div>
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
