'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { PAGE_KEY, SEARCH_KEY } from '~/constants';
import { useStore } from '~/store/store';
import styles from './SearchBar.module.css';

interface SearchBarNextProps {
  initialQuery: string;
}

export default function SearchBar({ initialQuery }: SearchBarNextProps) {
  const [query, setQuery] = useState(initialQuery);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setPending } = useStore();
  const t = useTranslations('common');

  useEffect(() => {
    setPending(isPending);
  }, [isPending, setPending]);

  const handleSearch = () => {
    const trimmedQuery = query.trim();
    const params = new URLSearchParams(searchParams);

    if (trimmedQuery) {
      params.set(SEARCH_KEY, trimmedQuery);
    } else {
      params.delete(SEARCH_KEY);
    }
    params.set(PAGE_KEY, '1');

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  const handleClear = () => {
    setQuery('');
    const params = new URLSearchParams(searchParams);
    params.delete('search_query');
    params.set('page', '1');

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className={styles.searchBar}>
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('search')}
          className={styles.input}
          disabled={isPending}
        />
        {query && (
          <button onClick={handleClear} className={styles.clearButton} disabled={isPending}>
            &#xD7;
          </button>
        )}
      </div>
      <button onClick={handleSearch} className={styles.searchButton} disabled={isPending}>
        {t('search')}
      </button>
    </div>
  );
}
