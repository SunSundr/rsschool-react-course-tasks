import { Component } from 'react';
import { LS_SEARCHTERM_KEY } from '~/constants';
import { fetchImagesConfig, fetchMovies } from '~/services/movieService';
import { ImageConfiguration, TMDBSearchResult } from '~/types';
import { callWithDelay } from '~/utils/callWithDelay';
import { ErrorData, errorLog, formatErrorData, getErrorData } from '~/utils/error';
import styles from './App.module.css';
import CardList from '../CardList/CardList';
import Empty from '../Empty/Empty';
import { ErrorInfo } from '../ErrorInfo/ErrorInfo';
import { Footer } from '../Footer/Footer';
import { Header } from '../Header/Header';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import SearchBar from '../SearchBar/SearchBar';

interface AppState {
  searchTerm: string;
  result?: TMDBSearchResult;
  imagesConfig: ImageConfiguration | null;
  loading: boolean;
  errorData: ErrorData | null;
  defaultResult?: TMDBSearchResult;
  currentPage: number;
}

class App extends Component<unknown, AppState> {
  state: AppState = {
    searchTerm: localStorage.getItem(LS_SEARCHTERM_KEY) || '',
    imagesConfig: null,
    loading: false,
    errorData: null,
    currentPage: 1,
  };

  fetchSearch = async (query: string, loadMore = false, delay?: number) => {
    if (!this.state.imagesConfig) return;
    this.setState({ loading: true, errorData: null });
    callWithDelay(async () => {
      try {
        if (!query && this.state.defaultResult) {
          callWithDelay(() => this.setState({ result: this.state.defaultResult, loading: false }));
          return;
        }
        const data = await fetchMovies(query, this.state.currentPage);
        if (loadMore && this.state.result) {
          data.results = [...this.state.result.results, ...data.results];
        }
        this.setState({ result: data, loading: false, ...(!query && { defaultResult: data }) });
      } catch (error) {
        this.setState({ errorData: getErrorData(error), loading: false });
      }
    }, delay);
  };

  fetchImagesConfig = async () => {
    this.setState({ loading: true, errorData: null });
    try {
      const data = await fetchImagesConfig();
      this.setState({ imagesConfig: data });
    } catch (error) {
      this.setState({ errorData: getErrorData(error), loading: false });
    }
  };

  handleSearch = (query: string) => {
    const trimmedQuery = query.trim();
    this.setState({ searchTerm: trimmedQuery, currentPage: 1, result: undefined });
    this.fetchSearch(trimmedQuery);
    localStorage.setItem(LS_SEARCHTERM_KEY, trimmedQuery);
  };

  handleClear = async (clearDefault = false) => {
    const newState = {
      searchTerm: '',
      currentPage: 1,
      ...(clearDefault && { defaultResult: undefined }),
    };
    this.setState(newState);
    await this.fetchSearch('');
    localStorage.removeItem(LS_SEARCHTERM_KEY);
  };

  handleShowMore = async () => {
    if (this.state.loading) return;
    this.setState({ currentPage: this.state.currentPage + 1 });
    this.fetchSearch(this.state.searchTerm, true, 0);
  };

  componentDidMount() {
    this.fetchImagesConfig().then(() =>
      callWithDelay(() => this.fetchSearch(this.state.searchTerm, false, 0), 200),
    );
  }

  getContent = (state: AppState) => {
    if (state.errorData) {
      errorLog(formatErrorData(state.errorData));
      return <ErrorInfo message={state.errorData.message} />;
    } else if (state.loading && state.currentPage === 1) {
      return <LoadingSpinner />;
    } else if (state.result?.results.length && state.imagesConfig) {
      return <CardList results={state.result.results} imagesConfig={state.imagesConfig} />;
    } else if (state.imagesConfig) {
      return <Empty />;
    }
  };

  render() {
    const { state } = this;
    return (
      <div className={`${styles.app} dark`}>
        <Header updateSearch={this.handleClear} />
        <main className={styles.content}>
          <SearchBar
            onSearch={this.handleSearch}
            onClear={this.handleClear}
            initialValue={state.searchTerm}
            loading={state.loading}
          />
          <div className={styles.paper}>{this.getContent(state)}</div>
          {state.loading && state.currentPage > 1 && <LoadingSpinner overlay={true} />}
          {state.result && state.result.total_pages > state.currentPage && state.searchTerm && (
            <button onClick={this.handleShowMore} className={styles.showMoreButton}>
              Show More
            </button>
          )}
        </main>
        <Footer />
      </div>
    );
  }
}

export default App;
