import { useContext, useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { CardList } from '~/components/CardList/CardList';
import { Empty } from '~/components/Empty/Empty';
import { ErrorInfo } from '~/components/ErrorInfo/ErrorInfo';
import { Flyout } from '~/components/Flyout/Flyout';
import { RefreshContext } from '~/components/Layout/Layout';
import { LoadingSpinner } from '~/components/LoadingSpinner/LoadingSpinner';
import { SearchBar } from '~/components/SearchBar/SearchBar';
import { LS_SEARCHTERM_KEY } from '~/constants';
import { useImagesConfig } from '~/hooks/useImagesConfig';
import { useLocalStorage } from '~/hooks/useLocalStorage';
import { useMovies } from '~/hooks/useMovies';
import { useRefreshData } from '~/hooks/useRefreshData';
import { callWithDelay } from '~/utils/callWithDelay';
import { errorLog } from '~/utils/error';
import styles from './MainPage.module.css';

export const MainPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useLocalStorage(LS_SEARCHTERM_KEY, '');
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1', 10));
  const [updateTrigger, setUpdateTrigger] = useState(false);

  const refreshContext = useContext(RefreshContext);
  const location = useLocation();
  const { refreshMovies } = useRefreshData();

  const { data: imagesConfig, isLoading: imagesLoading, error: imagesError } = useImagesConfig();
  const {
    data: result,
    isLoading: moviesLoading,
    error: moviesError,
  } = useMovies(searchTerm, currentPage);

  const loading = imagesLoading || moviesLoading;
  const errorData = imagesError || moviesError;

  const updateParams = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);
    callWithDelay(() => {
      Object.entries(newParams).forEach(([key, value]) => {
        params.set(key, value);
      });
      setSearchParams(params);
    }, 0);
  };

  const needNavigateHome = (query: string): boolean => {
    if (location.pathname !== '/') {
      refreshContext.handleCloseTrigger();
      callWithDelay(() => {
        if (query) {
          handleSearch(query, false);
        } else {
          handleClear(false);
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
    setCurrentPage(1);
    updateParams({ page: '1' });
  };

  const handleClear = async (checkNavigate = true) => {
    if (checkNavigate && needNavigateHome('')) return;
    setSearchTerm('');
    setUpdateTrigger(refreshContext.updateTrigger);
    setCurrentPage(1);
    updateParams({ page: '1' });
  };

  const handlePageChange = async (page: number) => {
    if (loading) return;
    setCurrentPage(page);
    updateParams({ page: page.toString() });
  };

  const handleRefresh = () => {
    refreshMovies(searchTerm, currentPage);
  };

  useEffect(() => {
    if (refreshContext.updateTrigger !== updateTrigger) {
      handleClear();
    }
  }, [refreshContext.updateTrigger]);

  const getContent = () => {
    if (errorData) {
      errorLog(errorData.message || 'Unknown error');
      return <ErrorInfo message={errorData.message || 'Unknown error'} />;
    } else if (loading) {
      return <LoadingSpinner />;
    } else if (result?.results.length && imagesConfig) {
      return (
        <CardList
          results={result.results}
          imagesConfig={imagesConfig}
          currentPage={currentPage}
          totalPages={result.total_pages}
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
        onRefresh={handleRefresh}
      />
      <div className={styles.paper}>{getContent()}</div>
      {result && <Flyout />}
    </>
  );
};
