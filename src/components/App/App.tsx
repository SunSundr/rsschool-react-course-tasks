import { Component } from 'react';
import { LS_SEARCHTERM_KEY } from '~/constants';
import { ImageConfiguration, TMDBSearchResult } from '~/types';
import { callWithDelay } from '~/utils/delay';
import { ErrorData, getErrorData } from '~/utils/error';
import { getMovie, getMoviePopTop } from '~/utils/getMovie';
import { imagesConfig } from '~/utils/imagesConfig';
import styles from './App.module.css';
import CardList from '../CardList/CardList';
import Empty from '../Empty/Empty';
import { Footer } from '../Footer/Footer';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import SearchBar from '../SearchBar/SearchBar';

interface AppState {
  searchTerm: string;
  result?: TMDBSearchResult;
  imagesConfig: ImageConfiguration | null;
  loading: boolean;
  errorData: ErrorData | null;
  topResult?: TMDBSearchResult;
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

  fetchSearch = async (query: string, loadMore = false) => {
    if (!this.state.imagesConfig) return;
    this.setState({ loading: true, errorData: null });
    callWithDelay(async () => {
      try {
        if (!query && this.state.topResult) {
          setTimeout(() => {
            this.setState({ result: this.state.topResult, loading: false });
          }, 400);
          return;
        }
        const data = query
          ? await getMovie(query, { page: this.state.currentPage.toString() })
          : await getMoviePopTop();
        if (loadMore && this.state.result) {
          data.results = [...this.state.result.results, ...data.results];
        }
        this.setState({ result: data, loading: false });
        if (!query) this.setState({ topResult: data });
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

  handleClear = async () => {
    if (!this.state.topResult) {
      this.setState({ searchTerm: '', currentPage: 1 });
      await this.fetchSearch('');
    }
    this.setState({ searchTerm: '', result: this.state.topResult, currentPage: 1 });
    localStorage.removeItem(LS_SEARCHTERM_KEY);
  };

  handleShowMore = async () => {
    this.setState({ currentPage: this.state.currentPage + 1 });
    this.fetchSearch(this.state.searchTerm, true);
  };

  componentDidMount() {
    this.fetchImagesConfig().then(() => {
      setTimeout(() => {
        this.fetchSearch(this.state.searchTerm);
      }, 0);
    });
  }

  getContent = () => {
    if (this.state.errorData) {
      return <div>Error: {this.state.errorData.message}</div>;
    } else if (this.state.loading && this.state.currentPage === 1) {
      return <LoadingSpinner />;
    } else if (
      this.state.result &&
      this.state.result?.results.length !== 0 &&
      this.state.imagesConfig
    ) {
      return (
        <CardList results={this.state.result.results} imagesConfig={this.state.imagesConfig} />
      );
    } else if (this.state.imagesConfig) {
      return <Empty />;
    }
  };

  render() {
    return (
      <div className={`${styles.app} dark`}>
        <header className={styles.header}>TMDB Movie&#9679;Search</header>
        <main className={styles.content}>
          <SearchBar
            onSearch={this.handleSearch}
            onClear={this.handleClear}
            initialValue={this.state.searchTerm}
            loading={this.state.loading}
          />
          <div className={styles.paper}>{this.getContent()}</div>
          {this.state.loading && this.state.currentPage > 1 && <LoadingSpinner overlay={true} />}
          {this.state.result &&
            this.state.result.total_pages > this.state.currentPage &&
            this.state.searchTerm && (
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
