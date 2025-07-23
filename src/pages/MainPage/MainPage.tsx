import { useContext, useEffect, useState } from 'react';
import { CardList } from '~/components/CardList/CardList';
import { Empty } from '~/components/Empty/Empty';
import { ErrorInfo } from '~/components/ErrorInfo/ErrorInfo';
import { RefreshContext } from '~/components/Layout/Layout';
import { LoadingSpinner } from '~/components/LoadingSpinner/LoadingSpinner';
import { SearchBar } from '~/components/SearchBar/SearchBar';
import { LS_SEARCHTERM_KEY } from '~/constants';
import { fetchImagesConfig, fetchMovies } from '~/services/movieService';
import { ImageConfiguration, TMDBSearchResult } from '~/types';
import { callWithDelay } from '~/utils/callWithDelay';
import { ErrorData, errorLog, formatErrorData, getErrorData } from '~/utils/error';
import styles from './MainPage.module.css';

export const MainPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState(localStorage.getItem(LS_SEARCHTERM_KEY) || '');
  const [result, setResult] = useState<TMDBSearchResult | undefined>();
  const [imagesConfig, setImagesConfig] = useState<ImageConfiguration | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorData, setErrorData] = useState<ErrorData | null>(null);
  const [defaultResult, setDefaultResult] = useState<TMDBSearchResult | undefined>();
  const [currentPage, setCurrentPage] = useState(1);
  const [updateTrigger, setUpdateTrigger] = useState(false);

  const refreshContext = useContext(RefreshContext);

  const fetchSearch = async (
    query: string,
    loadMore = false,
    delay?: number,
    firstInit = false,
  ) => {
    if (!firstInit && !imagesConfig) return;
    setLoading(true);
    setErrorData(null);

    callWithDelay(async () => {
      try {
        if (!query && defaultResult) {
          callWithDelay(() => {
            setResult(defaultResult);
            setLoading(false);
          });
          return;
        }

        const data = await fetchMovies(query, currentPage);
        if (loadMore && result) {
          data.results = [...result.results, ...data.results];
        }

        setResult(data);
        setLoading(false);
        if (!query) {
          setDefaultResult(data);
        }
      } catch (error) {
        setErrorData(getErrorData(error));
        setLoading(false);
      }
    }, delay);
  };

  const fetchImgConfig = async () => {
    setLoading(true);
    setErrorData(null);
    try {
      const data = await fetchImagesConfig();
      setImagesConfig(data);
    } catch (error) {
      setErrorData(getErrorData(error));
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    const trimmedQuery = query.trim();
    setSearchTerm(trimmedQuery);
    setCurrentPage(1);
    setResult(undefined);
    fetchSearch(trimmedQuery);
    localStorage.setItem(LS_SEARCHTERM_KEY, trimmedQuery);
  };

  const handleClear = async (clearDefault = false) => {
    setSearchTerm('');
    setCurrentPage(1);
    setUpdateTrigger(refreshContext.updateTrigger);
    if (clearDefault) {
      setDefaultResult(undefined);
    }
    await fetchSearch('');
    localStorage.removeItem(LS_SEARCHTERM_KEY);
    localStorage.removeItem('reset');
  };

  const handleShowMore = async () => {
    if (loading) return;
    setCurrentPage((prevPage) => prevPage + 1);
    fetchSearch(searchTerm, true, 0);
  };

  useEffect(() => {
    fetchImgConfig().then(() => callWithDelay(() => fetchSearch(searchTerm, false, 0, true), 0));
  }, []);

  useEffect(() => {
    if (loading) return;
    if (refreshContext.updateTrigger !== updateTrigger) {
      handleClear(true);
    }
  }, [refreshContext.updateTrigger]);

  const getContent = () => {
    if (errorData) {
      errorLog(formatErrorData(errorData));
      return <ErrorInfo message={errorData.message} />;
    } else if (loading && currentPage === 1) {
      return <LoadingSpinner />;
    } else if (result?.results.length && imagesConfig) {
      return <CardList results={result.results} imagesConfig={imagesConfig} />;
    } else if (imagesConfig) {
      return <Empty />;
    }
  };

  return (
    <>
      <SearchBar
        key={Date.now()}
        onSearch={handleSearch}
        onClear={handleClear}
        initialValue={searchTerm}
        loading={loading}
      />
      <div className={styles.paper}>{getContent()}</div>
      {loading && currentPage > 1 && <LoadingSpinner overlay={true} />}
      {result && result.total_pages > currentPage && searchTerm && (
        <button onClick={handleShowMore} className={styles.showMoreButton}>
          Show More
        </button>
      )}
    </>
  );
};
