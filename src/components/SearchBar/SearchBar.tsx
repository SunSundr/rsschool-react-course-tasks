import React, { useEffect, useState } from 'react';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onClear: () => void;
  initialValue: string;
  loading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onClear,
  initialValue,
  loading,
}) => {
  const [query, setQuery] = useState(initialValue || '');

  useEffect(() => {
    setQuery(initialValue || '');
  }, [initialValue]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && query.trim()) {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    setQuery(query.trim());
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onClear();
  };

  return (
    <div className={styles.searchBar}>
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Search for movies..."
          className={styles.input}
          disabled={loading}
        />
        {query && (
          <button onClick={handleClear} className={styles.clearButton} disabled={loading}>
            &#xD7;
          </button>
        )}
      </div>
      <button onClick={handleSubmit} className={styles.searchButton} disabled={loading}>
        Search
      </button>
    </div>
  );
};
