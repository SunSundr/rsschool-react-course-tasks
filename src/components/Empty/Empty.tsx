import { Component } from 'react';
import styles from './Empty.module.css';

class Empty extends Component {
  tips = [
    'Try searching for "Avengers"',
    'Try searching for "Batman"',
    'Try searching for "Star Wars"',
    'Try searching for "Marvel"',
    'Try searching for "Disney"',
    'Try searching for "Comedy"',
    'Try searching for "Action"',
    'Try searching for "Horror"',
  ];

  getRandomTip = () => {
    return this.tips[Math.floor(Math.random() * this.tips.length)];
  };

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h3 className={styles.title}>Sorry, nothing was found...</h3>
          <p className={styles.tip}>{this.getRandomTip()}</p>
        </div>
      </div>
    );
  }
}

export default Empty;
