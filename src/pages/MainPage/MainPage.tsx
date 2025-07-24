import { useContext, useEffect, useState } from 'react';
// import { Outlet } from 'react-router-dom';
import { useLocation, useSearchParams } from 'react-router-dom';
import { CardList } from '~/components/CardList/CardList';
import { Empty } from '~/components/Empty/Empty';
import { ErrorInfo } from '~/components/ErrorInfo/ErrorInfo';
import { RefreshContext } from '~/components/Layout/Layout';
import { LoadingSpinner } from '~/components/LoadingSpinner/LoadingSpinner';
import { SearchBar } from '~/components/SearchBar/SearchBar';
import { LS_SEARCHTERM_KEY } from '~/constants';
import { useLocalStorage } from '~/hooks/useLocalStorage';
import { fetchImagesConfig, fetchMovies } from '~/services/movieService';
import { ImageConfiguration, TMDBSearchResult } from '~/types';
import { callWithDelay } from '~/utils/callWithDelay';
import { ErrorData, errorLog, formatErrorData, getErrorData } from '~/utils/error';
import styles from './MainPage.module.css';

export const MainPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useLocalStorage(LS_SEARCHTERM_KEY, '');
  const [result, setResult] = useState<TMDBSearchResult | undefined>();
  const [imagesConfig, setImagesConfig] = useState<ImageConfiguration | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorData, setErrorData] = useState<ErrorData | null>(null);
  const [defaultResult, setDefaultResult] = useState<TMDBSearchResult | undefined>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1', 10));
  const [totalPages, setTotalPages] = useState(1);
  const [updateTrigger, setUpdateTrigger] = useState(false);

  const refreshContext = useContext(RefreshContext);
  const location = useLocation();

  const updateParams = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);
    callWithDelay(() => {
      console.log('updateParams', searchParams.get('q'));
      Object.entries(newParams).forEach(([key, value]) => {
        params.set(key, value);
      });
      setSearchParams(params);
    }, 0);
  };

  const fetchSearch = async (
    query: string,
    delay?: number,
    firstInit = false,
    clearDefault = false,
    page = 1,
  ) => {
    if (!firstInit && !imagesConfig) return;
    setLoading(true);
    setErrorData(null);

    callWithDelay(async () => {
      try {
        if (!query && page === 1 && defaultResult && !clearDefault) {
          callWithDelay(() => {
            setResult(defaultResult);
            setLoading(false);
            updateParams({ page: '1' });
            setTotalPages(defaultResult.total_pages);
            setCurrentPage(1);
          });
          return;
        }
        const data = await fetchMovies(query, page);
        setCurrentPage(page);
        setResult(data);
        setLoading(false);
        setTotalPages(data.total_pages);
        updateParams({ page: page.toString() });
        if (!query && page === 1) setDefaultResult(data);
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

  const needNavigateHome = (query: string): boolean => {
    if (location.pathname !== '/') {
      refreshContext.handleCloseTrigger();
      callWithDelay(() => {
        if (query) {
          handleSearch(query, false);
        } else {
          handleClear(false, false);
        }
      }, 1000);
      return true;
    }
    return false;
  };

  const handleSearch = (query: string, checkNavigate = true) => {
    const trimmedQuery = query.trim();
    setSearchTerm(trimmedQuery);
    if (checkNavigate && needNavigateHome(trimmedQuery)) return;
    setResult(undefined);
    fetchSearch(trimmedQuery);
  };

  const handleClear = async (clearDefault = false, checkNavigate = true) => {
    if (checkNavigate && needNavigateHome('')) return;
    setSearchTerm('');
    setUpdateTrigger(refreshContext.updateTrigger);
    if (clearDefault) setDefaultResult(undefined);
    await fetchSearch('', undefined, false, clearDefault);
  };

  const handlePageChange = async (page: number) => {
    if (loading) return;
    fetchSearch(searchTerm, 0, false, false, page);
  };

  useEffect(() => {
    fetchImgConfig().then(() =>
      callWithDelay(() => fetchSearch(searchTerm, 0, true, false, currentPage), 0),
    );
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
    } else if (loading) {
      return <LoadingSpinner />;
    } else if (result?.results.length && imagesConfig) {
      return (
        <CardList
          results={result.results}
          imagesConfig={imagesConfig}
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
      );
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
    </>
  );
};
