import { Component, ReactNode } from 'react';
import { getErrorData } from '~/utils/error';
import styles from './ErrorBoundary.module.css';

export interface ErrorBoundaryState {
  error: unknown;
  errorInfo?: React.ErrorInfo | null;
}

export interface ErrorBoundaryProps {
  children: ReactNode;
}

const initState = { error: null };

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = initState;

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { error: true };
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    this.setState({
      error: error,
      errorInfo: info,
    });
    console.error('Error caught: ', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className={styles.container}>
          <div className={styles.card}>
            <h2 className={styles.title}>Something went wrong</h2>
            <p className={styles.message}>{getErrorData(this.state.error).message}</p>
            <button onClick={() => this.setState(initState)} className={styles.resetButton}>
              Reset Error
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
