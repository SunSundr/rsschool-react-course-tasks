import { Component } from 'react';
import { LS_SEARCHTERM_KEY } from '~/constants';
import { TMDBSearchResult } from '~/types';
import { getMovie } from '~/utils/api';
import { callWithDelay } from '~/utils/delay';
import style from './App.module.css';
import CardList from '../CardList/CardList';
import SearchBar from '../SearchBar/SearchBar';

interface AppState {
  searchTerm: string;
  result?: TMDBSearchResult;
  loading: boolean;
  error: string | null;
}

class App extends Component<unknown, AppState> {
  state: AppState = {
    searchTerm: localStorage.getItem(LS_SEARCHTERM_KEY) || '',
    loading: false,
    error: null,
  };

  fetchSearch = (query: string) => {
    this.setState({ loading: true, error: null });
    getMovie(query)
      .then((data) => {
        callWithDelay(() => {
          this.setState({ result: data, loading: false });
        });
        console.log('>>', query, data.results[0]);
      })
      .catch((error) => {
        this.setState({ error: error.message, loading: false });
        console.log('>>', error);
      });
  };

  handleSearch = (query: string) => {
    const trimmedQuery = query.trim();
    this.setState({ searchTerm: trimmedQuery });
    localStorage.setItem(LS_SEARCHTERM_KEY, trimmedQuery);
    this.fetchSearch(trimmedQuery);
  };

  componentDidMount() {
    this.fetchSearch(this.state.searchTerm);
  }

  render() {
    return (
      <div className={`${style.app} dark`}>
        <header className={style.header}>App</header>
        <main className={style.content}>
          <div className={style.paper}>
            <SearchBar onSearch={this.handleSearch} initialValue={this.state.searchTerm} />
            <CardList results={this.state.result?.results} />
          </div>
        </main>
        <footer className={style.footer}>Footer</footer>
      </div>
    );
  }
}

export default App;
