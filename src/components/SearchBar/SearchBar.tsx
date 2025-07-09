import { Component } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialValue: string;
}

interface SearchBarState {
  query: string;
}

class SearchBar extends Component<SearchBarProps, SearchBarState> {
  state: SearchBarState = { query: this.props.initialValue || '' };

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ query: event.target.value });
  };

  handleSubmit = () => {
    this.props.onSearch(this.state.query);
  };

  render() {
    return (
      <div>
        <input type="text" value={this.state.query} onChange={this.handleChange} />
        <button onClick={this.handleSubmit}>Search</button>
      </div>
    );
  }
}

export default SearchBar;
