import { Component } from 'react';
import { LS_SEARCHTERM_KEY } from '~/constants';
import { ImageConfiguration, TMDBSearchResult } from '~/types';
import { callWithDelay } from '~/utils/delay';
import { ErrorData, getErrorData } from '~/utils/error';
import { getMovie } from '~/utils/getMovie';
import { imagesConfig } from '~/utils/imagesConfig';
import style from './App.module.css';
import CardList from '../CardList/CardList';
import Empty from '../Empty/Empty';
import SearchBar from '../SearchBar/SearchBar';

interface AppState {
  searchTerm: string;
  result?: TMDBSearchResult;
  imagesConfig: ImageConfiguration | null;
  loading: boolean;
  errorData: ErrorData | null;
}

class App extends Component<unknown, AppState> {
  state: AppState = {
    searchTerm: localStorage.getItem(LS_SEARCHTERM_KEY) || '',
    imagesConfig: null,
    loading: false,
    errorData: null,
  };

  fetchSearch = async (query: string) => {
    if (!this.state.searchTerm && !this.state.imagesConfig) return;
    this.setState({ loading: true, errorData: null });
    callWithDelay(async () => {
      try {
        const data = await getMovie(query);
        this.setState({ result: data, loading: false });
      } catch (error) {
        this.setState({ errorData: getErrorData(error), loading: false });
      }
    });
  };

  fetchImagesConfig = async () => {
    this.setState({ loading: true, errorData: null });
    try {
      const data = await imagesConfig();
      this.setState({ imagesConfig: data, loading: false });
    } catch (error) {
      this.setState({ errorData: getErrorData(error), loading: false });
    }
  };

  handleSearch = (query: string) => {
    const trimmedQuery = query.trim();
    this.setState({ searchTerm: trimmedQuery });
    localStorage.setItem(LS_SEARCHTERM_KEY, trimmedQuery);
    this.fetchSearch(trimmedQuery);
  };

  handleClear = () => {
    this.setState({ searchTerm: '', result: undefined });
    localStorage.removeItem(LS_SEARCHTERM_KEY);
  };

  componentDidMount() {
    this.fetchImagesConfig().then(() => this.fetchSearch(this.state.searchTerm));
  }

  render() {
    return (
      <div className={`${style.app} dark`}>
        <header className={style.header}>App</header>
        <main className={style.content}>
          <SearchBar
            onSearch={this.handleSearch}
            onClear={this.handleClear}
            initialValue={this.state.searchTerm}
          />
          <div className={style.paper}>
            {this.state.result?.results.length === 0 ? (
              <Empty />
            ) : (
              this.state.result &&
              this.state.imagesConfig && (
                <CardList
                  results={this.state.result.results}
                  imagesConfig={this.state.imagesConfig}
                />
              )
            )}
          </div>
        </main>
        <footer className={style.footer}>Footer</footer>
      </div>
    );
  }
}

export default App;
