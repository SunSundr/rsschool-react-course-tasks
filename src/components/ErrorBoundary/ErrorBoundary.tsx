import { Component, ReactNode } from 'react';
import { errorLog, getErrorData } from '~/utils/error';
import styles from './ErrorBoundary.module.css';

export interface ErrorBoundaryState {
  error: unknown;
  errorInfo?: React.ErrorInfo | null;
}

export interface ErrorBoundaryProps {
  children: ReactNode;
}

const initState = { error: null };

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = initState;

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { error: true };
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo: info,
    });
    errorLog(getErrorData(error).message, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className={styles.container}>
          <div className={styles.card}>
            <h2 className={styles.title}>Something went wrong</h2>
            <p className={styles.message}>{getErrorData(this.state.error).message}</p>
            <button onClick={() => window.location.reload()} className={styles.resetButton}>
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
