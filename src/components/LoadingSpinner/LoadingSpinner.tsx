import { Component } from 'react';
import styles from './LoadingSpinner.module.css';

class LoadingSpinner extends Component {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.spinner}>
          <div className={styles.text}>LOADING</div>
        </div>
      </div>
    );
  }
}

export default LoadingSpinner;
