import { Component } from 'react';
import styles from './ErrorButton.module.css';

export class ErrorButton extends Component {
  state = { error: false };

  render() {
    if (this.state.error) {
      const dateObject = new Date(Date.now());
      throw new Error(`Custom error generated at ${dateObject.toLocaleString()}`);
    }
    return (
      <button
        onClick={() => this.setState({ error: true })}
        type="button"
        className={styles.errorButton}
      >
        Error Button
      </button>
    );
  }
}
