import { Component } from 'react';
import styles from './ErrorInfo.module.css';

interface ErrorInfoProps {
  message: string;
}

export class ErrorInfo extends Component<ErrorInfoProps> {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h3 className={styles.title}>Error</h3>
          <p className={styles.message}>{this.props.message}</p>
        </div>
      </div>
    );
  }
}
