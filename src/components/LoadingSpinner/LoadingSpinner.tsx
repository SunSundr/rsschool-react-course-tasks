import { Component } from 'react';
import styles from './LoadingSpinner.module.css';

interface LoadingSpinnerProps {
  overlay?: boolean;
}

class LoadingSpinner extends Component<LoadingSpinnerProps> {
  render() {
    return (
      <div className={`${styles.container} ${this.props.overlay ? styles.overlay : ''}`}>
        <div className={styles.spinner}>
          <div className={styles.text}>LOADING</div>
        </div>
      </div>
    );
  }
}

export default LoadingSpinner;
