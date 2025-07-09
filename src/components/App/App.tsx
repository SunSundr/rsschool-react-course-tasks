import { Component } from 'react';
import style from './App.module.css';

class App extends Component {
  render() {
    return (
      <div className={`${style.app} dark`}>
        <header className={style.header}>App</header>
        <main className={style.content}>
          <div className={style.paper}>Content</div>
        </main>
        <footer className={style.footer}>Footer</footer>
      </div>
    );
  }
}

export default App;
