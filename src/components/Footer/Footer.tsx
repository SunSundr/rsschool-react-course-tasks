import { Component } from 'react';
import styles from './Footer.module.css';
import { ErrorButton } from '../ErrorButton/ErrorButton';

export class Footer extends Component {
  render() {
    return (
      <footer className={styles.footer}>
        <div className={styles.linksWrap}>
          <img style={{ height: 32 }} src="github-mark.svg"></img>
          <a
            className={styles.links}
            href="https://github.com/SunSundr/rsschool-react-course-tasks"
          >
            SunSundr/rsschool-react-course-tasks
          </a>
          <img
            style={{ height: 32 }}
            src="https://rs.school/_next/static/media/rss-logo.c19ce1b4.svg"
          ></img>
          <a className={styles.links} href="https://rs.school/">
            Rolling Scopes School
          </a>
        </div>
        <ErrorButton />
      </footer>
    );
  }
}
