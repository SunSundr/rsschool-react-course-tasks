import { Component } from 'react';
import { LS_SEARCHTERM_KEY, QUERY_KEY } from '~/constants';
import { ImageConfiguration, QueryType, TMDBSearchResult } from '~/types';
import { callWithDelay } from '~/utils/callWithDelay';
import { ErrorData, errorLog, getErrorData } from '~/utils/error';
import { getMovie, getMoviePopTop } from '~/utils/getMovie';
import { imagesConfig } from '~/utils/imagesConfig';
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

  getQueryType = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(QUERY_KEY) as QueryType;
  };

  fetchSearch = async (query: string, loadMore = false) => {
    if (!this.state.imagesConfig) return;
    this.setState({ loading: true, errorData: null });
    callWithDelay(async () => {
      try {
        if (!query && this.state.defaultResult) {
          callWithDelay(() => this.setState({ result: this.state.defaultResult, loading: false }));
          return;
        }
        const data = query
          ? await getMovie(query, { page: this.state.currentPage.toString() })
          : await getMoviePopTop(this.getQueryType());
        if (loadMore && this.state.result) {
          data.results = [...this.state.result.results, ...data.results];
        }
        this.setState({ result: data, loading: false });
        if (!query) this.setState({ defaultResult: data });
      } catch (error) {
        this.setState({ errorData: getErrorData(error), loading: false });
      }
    });
  };

  fetchImagesConfig = async () => {
    this.setState({ loading: true, errorData: null });
    try {
      const data = await imagesConfig();
      this.setState({ imagesConfig: data });
    } catch (error) {
      this.setState({ errorData: getErrorData(error), loading: false });
    }
  };

  handleSearch = (query: string) => {
    const trimmedQuery = query.trim();
    this.setState({ searchTerm: trimmedQuery, currentPage: 1, result: undefined });
    localStorage.setItem(LS_SEARCHTERM_KEY, trimmedQuery);
    this.fetchSearch(trimmedQuery);
  };

  handleClear = async (clearDefault = false) => {
    if (clearDefault) this.setState({ defaultResult: undefined });
    if (clearDefault || !this.state.defaultResult) {
      this.setState({ searchTerm: '', currentPage: 1 });
      await this.fetchSearch('');
    }
    this.setState({ searchTerm: '', result: this.state.defaultResult, currentPage: 1 });
    localStorage.removeItem(LS_SEARCHTERM_KEY);
  };

  handleShowMore = async () => {
    this.setState({ currentPage: this.state.currentPage + 1 });
    this.fetchSearch(this.state.searchTerm, true);
  };

  componentDidMount() {
    this.fetchImagesConfig().then(() =>
      callWithDelay(() => this.fetchSearch(this.state.searchTerm), 0),
    );
  }

  getContent = (state: AppState) => {
    if (state.errorData) {
      const { errorData } = state;
      errorLog(
        [
          errorData.name,
          errorData.statusCode ? `code ${errorData.statusCode}` : null,
          errorData.message,
        ]
          .filter(Boolean)
          .join(', '),
      );
      return <ErrorInfo message={state.errorData.message} />;
    } else if (state.loading && state.currentPage === 1) {
      return <LoadingSpinner />;
    } else if (state.result && state.result?.results.length !== 0 && state.imagesConfig) {
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
