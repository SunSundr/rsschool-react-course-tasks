import { Component } from 'react';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onClear: () => void;
  initialValue: string;
  loading: boolean;
}

interface SearchBarState {
  query: string;
}

class SearchBar extends Component<SearchBarProps, SearchBarState> {
  state: SearchBarState = { query: this.props.initialValue || '' };

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ query: event.target.value });
  };

  handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && this.state.query.trim()) {
      this.handleSubmit();
    }
  };

  handleSubmit = () => {
    this.props.onSearch(this.state.query);
  };

  handleClear = () => {
    this.setState({ query: '' });
    this.props.onClear();
  };

  render() {
    return (
      <div className={styles.searchBar}>
        <div className={styles.inputContainer}>
          <input
            type="text"
            value={this.state.query}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyDown}
            placeholder="Search for movies..."
            className={styles.input}
            disabled={this.props.loading}
          />
          {this.state.query && (
            <button
              onClick={this.handleClear}
              className={styles.clearButton}
              disabled={this.props.loading}
            >
              &#xD7;
            </button>
          )}
        </div>
        <button
          onClick={this.handleSubmit}
          className={styles.searchButton}
          disabled={this.props.loading}
        >
          Search
        </button>
      </div>
    );
  }
}

export default SearchBar;
